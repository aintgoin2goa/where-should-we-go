import * as Router from "koa-router";
import Users from "../models/users";
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

const whereToGo = (users: Users, venues: Venues): Router => {
  router.get("/wheretogo", async (ctx: Context) => {
    const venuesResult = venues.testVenues(users);
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
  });
  return router;
};

export default whereToGo;
