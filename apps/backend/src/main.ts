import { Application, Router, applyGraphQL, oakCors, Context } from "./deps.ts";
import { GraphQLSchema } from "./schema/index.ts";
import { resolvers } from "./resolver/resolver.ts";

const app = new Application();
const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: GraphQLSchema,
  resolvers: resolvers,
  context: (context: Context) => context
});

app.use(
  oakCors({
    origin: "http://localhost:3000",
  })
);

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8000");
await app.listen({ port: 8000 });
