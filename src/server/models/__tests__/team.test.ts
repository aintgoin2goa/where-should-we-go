import { readFileSync } from "fs";
import { resolve as resolvePath } from "path";
import Team, { CanVisitResult } from "../team";
import { Venue } from "../venues";

describe("Team Model", () => {
  const loadDataSpy = jest.fn();
  beforeAll(async () => {
    const mockData = JSON.parse(
      readFileSync(resolvePath(process.cwd(), "./test/data/users.json"), {
        encoding: "utf8"
      })
    );
    loadDataSpy.mockResolvedValue(mockData);
  });
  it("should load the user data from the server", async () => {
    const team = new Team(loadDataSpy);
    await team.load("url");
    expect(loadDataSpy).toHaveBeenCalledWith("url");
  });

  it("should ascertain whether the team can visit a given venue", async () => {
    const team = new Team(loadDataSpy);
    const venue: Venue = {
      name: "El Cantina",
      food: ["Mexican"],
      drinks: ["Soft drinks", "Tequila", "Beer"]
    };
    const expected: CanVisitResult = {
      canVisit: false,
      reasons: [
        "There is nothing for Robert to drink",
        "These is nothing for Bobby to eat"
      ]
    };
    await team.load("url");
    const result = team.canVisit(venue);
    expect(result).toEqual(expected);
  });
});
