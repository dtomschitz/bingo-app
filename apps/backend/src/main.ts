import {
  Application,
  applyGraphQL,
  Context,
  GQLError,
  oakCors,
  Router,
} from "./deps.ts";
import { ErrorType } from "./models.ts";
import { Database, GameDatabase, UserDatabase } from "./database/index.ts";
import { AuthService, GameService, SocketService } from "./service/index.ts";
import { resolvers } from "./resolver/index.ts";
import { GraphQLSchema } from "./schema/index.ts";
import { createContext } from "./utils/index.ts";

const databaseUser = Deno.env.get("DATABASE_USER");
const databasePassword = Deno.env.get("DATABASE_PASSWORD");

const database = new Database(
  "saturn",
  `mongodb://${databaseUser}:${databasePassword}@database:27017`,
);
await database.connect();

const userDatabase = new UserDatabase(database);
const gameDatabase = new GameDatabase(database);

const authService = new AuthService(userDatabase);
const gameService = new GameService(gameDatabase);
const socketService = new SocketService(gameDatabase);

const GraphQLService: any = await applyGraphQL<Router>({
  Router,
  typeDefs: GraphQLSchema,
  resolvers: resolvers(authService, gameService),
  context: async (context: Context) => {
    return await createContext(context, userDatabase);
  },
});

const router = new Router();
router.get("/ws", async (context) => {
  if (!context.isUpgradable) {
    throw new Error("Failed to upgrade the connection!");
  }

  const socket = await context.upgrade();
  const accessToken = context.request.url.searchParams.get("accessToken");
  if (!accessToken) {
    throw new GQLError(ErrorType.INCORRECT_REQUEST);
  }

  const user = await authService.verifyUser(accessToken);

  try {
    await socketService.handleGameEvents(socket, user);
  } catch (error) {
    console.error(`Failed to receive frame: ${error}`);

    if (!socket.isClosed) {
      await socket.close(1000).catch(console.error);
    }
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(
  oakCors({
    origin: "http://localhost:3000",
  }),
);

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8000");
await app.listen({ port: 8000 });

export default app;
