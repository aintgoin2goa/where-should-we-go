import * as Router from "koa-router";
import Team from "../models/team";
import Venues from "../models/venues";
import { Context } from "koa";

const router = new Router();

interface PlaceToAvoid {
  name: string;
  reasons: string[];
}

interface WheretoGoResponse {
  placesToGo: string[];
  placesToAvoid: PlaceToAvoid[];
}

const whereToGo = (team: Team, venues: Venues) => async (ctx: Context) => {
  const venuesResult = venues.testVenues(team);
  const response: WheretoGoResponse = {
    placesToGo: [],
    placesToAvoid: []
  };
  for (const venue of venuesResult) {
    if (venue.canVisit) {
      response.placesToGo.push(venue.name);
    } else {
      response.placesToAvoid.push({
        name: venue.name,
        reasons: venue.reasons
      });
    }
  }

  ctx.body = response;
};

const whereToGoRoutes = (team: Team, venues: Venues) => {
  router.get("/wheretogo", whereToGo(team, venues));
  return router.routes();
};

export default whereToGoRoutes;
