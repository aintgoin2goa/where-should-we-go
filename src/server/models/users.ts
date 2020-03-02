import loadData, { UserData } from "../lib/load-data";
import { Venue } from "./venues";

export class User {
  public firstName: string;
  private drinks: string[];
  private wontEat: string[];

  constructor(user: UserData) {
    this.firstName = user.name.split(" ")[0];
    this.drinks = user.drinks.map(d => d.toLowerCase());
    this.wontEat = user.wont_eat.map(d => d.toLowerCase());
  }

  canEatSomething(availableFoods: string[]): boolean {
    return (
      availableFoods.filter(food => !this.wontEat.includes(food.toLowerCase()))
        .length > 0
    );
  }

  canDrinkSomething(availableDrinks: string[]): boolean {
    return availableDrinks.some(drink =>
      this.drinks.includes(drink.toLowerCase())
    );
  }
}

export interface CanVisitResult {
  canVisit: boolean;
  reasons: string[];
}

export default class Users {
  private users: User[];

  async load(url) {
    const users = await loadData<UserData[]>(url);
    this.users = users.map(user => new User(user));
  }

  canVisit(venue: Venue) {
    const response: CanVisitResult = {
      canVisit: true,
      reasons: []
    };
    for (const user of this.users) {
      if (!user.canEatSomething(venue.food)) {
        response.canVisit = false;
        response.reasons.push(`These is nothing for ${user.firstName} to eat`);
        break;
      }

      if (!user.canDrinkSomething(venue.drinks)) {
        response.canVisit = false;
        response.reasons.push(
          `There is nothing for ${user.firstName} to drink`
        );
      }
    }

    return response;
  }
}
