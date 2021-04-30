import { gqlTypes } from "./schema/gql.types.ts";
import { Application, Router, RouterContext } from "./deps.ts";
import { applyGraphQL, GQLError } from "./deps.ts";
import { resolvers } from "./resolver/resolver.ts";
import { database } from "./database.ts";

const app = new Application();

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: gqlTypes,
  resolvers: resolvers,
  context: (ctx: RouterContext) => {
    return ctx;
  },
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

const author = database.getDatabase()?.collection("game");

console.log("Server start at http://localhost:8000");
await app.listen({ port: 8000 });
