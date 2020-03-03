import { readFileSync } from "fs";
import { resolve as resolvePath } from "path";
import Team, { CanVisitResult } from "../team";
import Venues, { VenueVisitableResult } from "../venues";

describe("Venues Model", () => {
  const loadDataSpy = jest.fn();
  let venues: Venues;
  let mockData;
  let team;
  beforeAll(async () => {
    mockData = JSON.parse(
      readFileSync(resolvePath(process.cwd(), "./test/data/venues.json"), {
        encoding: "utf8"
      })
    );
    loadDataSpy.mockResolvedValue(mockData);
    team = new Team(loadDataSpy);
  });

  beforeEach(async () => {
    venues = new Venues(loadDataSpy);
    await venues.load("url");
    const fakeCanVisitResult: CanVisitResult = {
      canVisit: false,
      reasons: ["fake reason"]
    };
    jest.spyOn(team, "canVisit").mockReturnValue(fakeCanVisitResult);
  });

  it("should load data from the server", () => {
    expect(loadDataSpy).toHaveBeenCalledWith("url");
  });

  it("should be able to test all the venues to see if the team can visit", () => {
    const expected: VenueVisitableResult[] = mockData.map(d => ({
      name: d.name,
      canVisit: false,
      reasons: ["fake reason"]
    }));
    const result = venues.testVenues(team);
    expect(result).toEqual(expected);
  });
});
