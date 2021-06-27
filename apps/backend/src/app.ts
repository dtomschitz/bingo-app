import {
  Application,
  applyGraphQL,
  Context,
  GQLError,
  oakCors,
  Router,
} from './deps.ts';
import { ErrorType } from './models.ts';
import { GameDatabase, UserDatabase } from './database/index.ts';
import {
  AuthService,
  UserService,
  GameService,
  SocketService,
} from './service/index.ts';
import { resolvers } from './resolver/index.ts';
import { GraphQLSchema } from './schema/index.ts';
import { createContext } from './utils/index.ts';

type DatabaseConfig<T> = T | { instance: T, clearOnConnect: boolean };

interface AppConfig {
  database: {
    user: DatabaseConfig<UserDatabase>,
    game: DatabaseConfig<GameDatabase>,
  },
}

const resolveDatabase = <T>(config: DatabaseConfig<T>) => {
  return 'instance' in config ? config.instance : config;
}

/**
 * Creates a new instance of the backend application.
 * 
 * @param config The app config containing the database instances.
 * @returns The newly created application.
 */
const createApp = async ({ database }: AppConfig ) => {
  const userDatabase = resolveDatabase(database.user);
  const gameDatabase = resolveDatabase(database.game);

  if ('instance' in database.user && database.user.clearOnConnect) {
    await userDatabase.clear();
  }

  if ('instance' in database.game && database.game.clearOnConnect) {
    await gameDatabase.clear();
  }

  const authService = new AuthService(userDatabase);
  const userService = new UserService(userDatabase);
  const gameService = new GameService(gameDatabase);
  const socketService = new SocketService(gameDatabase);
  
  const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs: GraphQLSchema,
    resolvers: resolvers(authService, userService, gameService),
    context: async (context: Context) => {
      return await createContext(context, userDatabase);
    },
  });
  
  const router = new Router();

  /**
   * A request which is send to /ws will be automatically upgrated to the 
   * WebSocket protocol. The WebSocket is used for managing 
   * the different game events.
   */
  router.get('/ws', async context => {
    if (!context.isUpgradable) {
      throw new Error('Failed to upgrade the connection!');
    }
  
    const socket = await context.upgrade();
    const accessToken = context.request.url.searchParams.get('accessToken');
    if (!accessToken) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }
  
    const user = await authService.verifyUser(accessToken);
  
    try {
      await socketService.handleGameEvents(socket, {
        ...user,
        _id: user._id.toHexString(),
      });
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
  
  app.use(oakCors({ origin: '*' }));
  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  return app;
}

export default createApp;