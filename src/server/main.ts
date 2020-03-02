import * as App from "koa";
import * as Router from "koa-router";
import * as dotenv from "dotenv";

import Users from "./models/users";
import Venues from "./models/venues";
import whereToGo from "./routes/wheretogo";

dotenv.config();

const PORT = Number(process.env.PORT);
const { USERS_URL, VENUES_URL } = process.env;

const app = new App();

const router = new Router();

router.get("/status", async ctx => {
  ctx.body = "OK";
});

const start = async () => {
  const users = new Users();
  const venues = new Venues();
  await Promise.all([venues.load(VENUES_URL), users.load(USERS_URL)]);
  const whereToGoRouter = whereToGo(users, venues);
  app.use(router.routes());
  app.use(whereToGoRouter.routes());
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
