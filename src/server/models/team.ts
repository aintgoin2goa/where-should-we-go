import _loadData from "../lib/load-data";
import { Venue } from "./venues";
import User, { UserData } from "./member";

export interface CanVisitResult {
  canVisit: boolean;
  reasons: string[];
}

export default class Team {
  private members: User[] = [];
  private loadData: typeof _loadData;

  constructor(loadData = _loadData) {
    this.loadData = loadData;
  }

  async load(url) {
    const members = await this.loadData<UserData[]>(url);
    this.members = members.map(user => new User(user));
  }

  canVisit(venue: Venue) {
    if (!this.members.length) {
      throw new Error("Team has no members");
    }
    const response: CanVisitResult = {
      canVisit: true,
      reasons: []
    };
    for (const member of this.members) {
      if (!member.canEatSomething(venue.food)) {
        response.canVisit = false;
        response.reasons.push(
          `These is nothing for ${member.firstName} to eat`
        );
        break;
      }

      if (!member.canDrinkSomething(venue.drinks)) {
        response.canVisit = false;
        response.reasons.push(
          `There is nothing for ${member.firstName} to drink`
        );
      }
    }

    return response;
  }
}
