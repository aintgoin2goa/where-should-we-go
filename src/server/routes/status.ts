import * as Router from "koa-router";

const router = new Router();

const status = () => {
  router.get("/status", async ctx => {
    ctx.body = "OK";
  });
  return router.routes();
};

export default status;
