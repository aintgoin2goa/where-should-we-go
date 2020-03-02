import loadData from "../lib/load-data";
import Users, { CanVisitResult } from "./users";

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

  async load(url: string) {
    this.venues = await loadData<Venue[]>(url);
  }

  testVenues(users: Users): VenueVisitableResult[] {
    return this.venues.map(venue => {
      return {
        ...users.canVisit(venue),
        name: venue.name
      };
    });
  }
}
