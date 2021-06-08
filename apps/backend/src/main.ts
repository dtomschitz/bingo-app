import { Application, applyGraphQL, Context, oakCors, Router } from "./deps.ts";
import { Database, GameDatabase, UserDatabase } from "./database/index.ts";
import { resolvers } from "./resolver/index.ts";
import { GraphQLSchema } from "./schema/index.ts";
import { createContext } from "./utils/index.ts";

const app = new Application();

const databaseUser = Deno.env.get("DATABASE_USER");
const databasePassword = Deno.env.get("DATABASE_PASSWORD");

const database = new Database(
  "saturn",
  `mongodb://${databaseUser}:${databasePassword}@database:27017`,
);
await database.connect();

const userDatabase = new UserDatabase(database);
const gameDatabase = new GameDatabase(database);

const GraphQLService:any = await applyGraphQL<Router>({
  Router,
  typeDefs: GraphQLSchema,
  resolvers: resolvers(userDatabase, gameDatabase),
  context: async (context: Context) => {
    return await createContext(context, userDatabase);
  },
});

app.use(
  oakCors({
    origin: "http://localhost:3000",
  }),
);

console.log(GraphQLService.routes()?.router)

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8000");
await app.listen({ port: 8000 });
