import { Application, Router, applyGraphQL, oakCors, Context } from "./deps.ts";
import { Database, UserDatabase, GameDatabase } from "./database/index.ts";
import { resolvers } from "./resolver/index.ts";
import { GraphQLSchema } from "./schema/index.ts";

const app = new Application();

const databaseUser = Deno.env.get("DATABASE_USER");
const databasePassword = Deno.env.get("DATABASE_PASSWORD");

const database = new Database('saturn', `mongodb://${databaseUser}:${databasePassword}@database:27017`);
await database.connect();

const userDatabase = new UserDatabase(database);
const gameDatabase = new GameDatabase(database);

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: GraphQLSchema,
  resolvers: resolvers(userDatabase, gameDatabase),
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
