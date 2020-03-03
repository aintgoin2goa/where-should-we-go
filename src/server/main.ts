import * as App from "koa";
import * as Router from "koa-router";
import * as dotenv from "dotenv";

import Team from "./models/team";
import Venues from "./models/venues";
import whereToGoRoutes from "./routes/wheretogo";
import statusRoutes from "./routes/status";

dotenv.config();

const PORT = Number(process.env.PORT);
const { USERS_URL, VENUES_URL } = process.env;

const app = new App();

const start = async () => {
  const team = new Team();
  const venues = new Venues();
  await Promise.all([venues.load(VENUES_URL), team.load(USERS_URL)]);
  app.use(statusRoutes());
  app.use(whereToGoRoutes(team, venues));
  app.listen(PORT);
};

start()
  .then(() => {
    console.log(`Listening on port ${PORT}`);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
