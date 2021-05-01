import { NestableRouter } from "./NestableRouter.ts";

const router = new NestableRouter();

router.get("/", (ctx:any) => {
  ctx.response.body = "Hello World!";
});

export default router.normalize();