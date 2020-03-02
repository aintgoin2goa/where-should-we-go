import "jest";
import { createServer, Server } from "http";
import * as serveStatic from "serve-static";
import * as finalhandler from "finalhandler";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as _waitForPort from "wait-for-port";
import fetch from "node-fetch";
import { promisify, inspect } from "util";
import { resolve as resolvePath } from "path";

const waitForPort = promisify(_waitForPort);

describe("Where should we go", () => {
  const serveDataFiles = serveStatic(resolvePath(__dirname, "./data"));
  let dataServer: Server;
  let app: ChildProcessWithoutNullStreams;

  const startDataServer = () => {
    dataServer = createServer((req, res) => {
      //@ts-ignore
      serveDataFiles(req, res, finalhandler(req, res));
    });
    dataServer.listen(6666);
  };

  const startApp = () => {
    app = spawn("yarn", ["start"], {
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: "8080",
        USERS_URL: "http://localhost:6666/users.json",
        VENUES_URL: "http://localhost:6666/venues.json"
      }
    });
    return waitForPort("localhost", 8080);
  };

  beforeAll(async () => {
    await Promise.all([startDataServer(), startApp()]);
  });

  afterAll(() => {
    app.kill();
    dataServer.close();
  });

  it("gets status", async () => {
    const resp = await fetch("http://localhost:8080/status");
    const status = await resp.text();
    expect(status).toEqual("OK");
  });

  it("should return the expected list of places to go", async () => {
    const response = await fetch("http://localhost:8080/wheretogo");
    const reply = await response.json();
    expect(reply).toHaveProperty("placesToGo");
    expect(reply.placesToGo).toEqual(["Spice of life", "The Cambridge"]);
  });

  it("should return the expected list of places to avoid, with reasons", async () => {
    const response = await fetch("http://localhost:8080/wheretogo");
    const reply = await response.json();
    expect(reply).toHaveProperty("placesToAvoid");
    expect(reply.placesToAvoid).toEqual([
      {
        name: "El Cantina",
        reasons: [
          "There is nothing for Robert to drink",
          "These is nothing for Bobby to eat"
        ]
      },
      { name: "Twin Dynasty", reasons: ["These is nothing for David to eat"] },
      { name: "Wagamama", reasons: ["There is nothing for Robert to drink"] },
      {
        name: "Sultan Sofrasi",
        reasons: ["There is nothing for Robert to drink"]
      },
      { name: "Spirit House", reasons: ["There is nothing for Alan to drink"] },
      { name: "Tally Joe", reasons: ["There is nothing for Robert to drink"] },
      {
        name: "Fabrique",
        reasons: [
          "There is nothing for Robert to drink",
          "There is nothing for David to drink"
        ]
      }
    ]);
  });
});
