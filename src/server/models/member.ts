export interface UserData {
  name: string;
  wont_eat: string[];
  drinks: string[];
}

export default class User {
  public firstName: string;
  public drinks: string[];
  public wontEat: string[];

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
