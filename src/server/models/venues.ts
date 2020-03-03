import _loadData from "../lib/load-data";
import Team, { CanVisitResult } from "./team";

export interface Venue {
  name: string;
  food: string[];
  drinks: string[];
}

export interface VenueVisitableResult extends CanVisitResult {
  name: string;
}

export default class Venues {
  private venues: Venue[];
  private loadData: typeof _loadData;

  constructor(loadData = _loadData) {
    this.loadData = loadData;
  }

  async load(url: string) {
    this.venues = await this.loadData<Venue[]>(url);
  }

  testVenues(team: Team): VenueVisitableResult[] {
    return this.venues.map(venue => {
      return {
        ...team.canVisit(venue),
        name: venue.name
      };
    });
  }
}
