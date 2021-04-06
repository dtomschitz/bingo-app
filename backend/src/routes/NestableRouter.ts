// NestableRouter.ts
// Fix for https://github.com/oakserver/oak/issues/6
import { Router, RouterMiddleware } from "../deps.ts";

export class NestableRouter {
  routes: Array<{
    method: "GET" | "DELETE" | "PATCH" | "POST";
    route: string;
    callbacks: Array<RouterMiddleware>;
  }>;

  constructor() {
    this.routes = [];
  }

  register(
    method: "GET" | "DELETE" | "PATCH" | "POST",
    route: string,
    callbacks: Array<RouterMiddleware>
  ): NestableRouter {
    this.routes.push({
      method,
      route,
      callbacks,
    });
    return this;
  }

  get(route: string, ...callbacks: Array<RouterMiddleware>): NestableRouter {
    this.register("GET", route, callbacks);
    return this;
  }
  delete(route: string, ...callbacks: Array<RouterMiddleware>): NestableRouter {
    this.register("DELETE", route, callbacks);
    return this;
  }
  patch(route: string, ...callbacks: Array<RouterMiddleware>): NestableRouter {
    this.register("PATCH", route, callbacks);
    return this;
  }
  post(route: string, ...callbacks: Array<RouterMiddleware>): NestableRouter {
    this.register("POST", route, callbacks);
    return this;
  }

  use(route: string, router: NestableRouter): NestableRouter {
    for (const subRoute of router.routes) {
      if (subRoute.method === "GET") {
        this.get(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "DELETE") {
        this.delete(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "PATCH") {
        this.patch(route + subRoute.route, ...subRoute.callbacks);
      } else if (subRoute.method === "POST") {
        this.post(route + subRoute.route, ...subRoute.callbacks);
      }
    }
    return this;
  }

  normalize(): Router {
    const oakRouter = new Router();
    for (const route of this.routes) {
      if (route.method === "GET") {
        oakRouter.get(route.route, ...route.callbacks);
      } else if (route.method === "DELETE") {
        oakRouter.delete(route.route, ...route.callbacks);
      } else if (route.method === "PATCH") {
        oakRouter.patch(route.route, ...route.callbacks);
      } else if (route.method === "POST") {
        oakRouter.post(route.route, ...route.callbacks);
      }
    }
    return oakRouter;
  }
}
