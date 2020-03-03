import User from "../member";

type TestCase = [string[], boolean];

interface TestCases {
  foods: TestCase[];
  drinks: TestCase[];
}

describe("Member Model", () => {
  const userData = {
    name: "Gary Jones",
    wont_eat: ["Eggs", "Pasta"],
    drinks: ["Tequila", "Soft drinks", "beer", "Coffee"]
  };
  const testCases: TestCases = {
    foods: [
      [["eggs", "pasta", "chips"], true],
      [["eggs", "pasta"], false]
    ],
    drinks: [
      [["rum", "gin", "water"], false],
      [["beer", "wine"], true]
    ]
  };
  it("should be able to parse the data from the server", () => {
    const user = new User(userData);
    expect(user.firstName).toEqual("Gary");
    expect(user.drinks).toEqual(userData.drinks.map(d => d.toLowerCase()));
    expect(user.wontEat).toEqual(userData.wont_eat.map(d => d.toLowerCase()));
  });

  it.each<[string[], boolean]>(testCases.foods)(
    "should be able to assertain if the user can eat any of the given foods",
    (availableFoods, expectedResult) => {
      const user = new User(userData);
      const result = user.canEatSomething(availableFoods);
      expect(result).toEqual(expectedResult);
    }
  );

  it.each<TestCase>(testCases.drinks)(
    "should be able to asscertain if the user can drink one of the available drinks",
    (availableDrinks, expectedResult) => {
      const user = new User(userData);
      const result = user.canDrinkSomething(availableDrinks);
      expect(result).toEqual(expectedResult);
    }
  );
});
