import {
  afterAll,
  assertEquals,
  beforeAll,
  describe,
  it,
} from './test.deps.ts';
import {
  createMockApp,
  createMockServerRequest,
  getDatabase,
  defaultUser,
} from './common.ts';
import { Context } from '../src/deps.ts';
import { createContext } from '../src/utils/index.ts';
import { AuthService } from '../src/service/index.ts';
import { Database, UserDatabase } from '../src/database/index.ts';

describe('GraphQL Utils', () => {
  describe('createContext', () => {
    let database: Database;
    let users: UserDatabase;
    let service: AuthService;

    beforeAll(async () => {
      database = await getDatabase();
      users = new UserDatabase(database);
      await users.clear();

      service = new AuthService(users);
    });

    afterAll(() => {
      database.close();
    });

    it('should fail because the access token is invalid', async () => {
      const app = createMockApp();
      const serverRequest = createMockServerRequest({
        headerValues: {
          Authorization: `Bearer invalid_access_token`,
        },
      });

      const context = await createContext(
        new Context(app, serverRequest),
        users,
      );
      assertEquals(context.authenticated, false);
      assertEquals(context.user, undefined);
    });

    it('should fail because the user does not exist', async () => {
      const { user, accessToken } = await service.registerUser(defaultUser);
      await users.deleteUser(user._id);

      const app = createMockApp();
      const serverRequest = createMockServerRequest({
        headerValues: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const context = await createContext(
        new Context(app, serverRequest),
        users,
      );
      assertEquals(context.authenticated, false);
      assertEquals(context.user, undefined);
    });

    it('should extend the base context', async () => {
      const { user, accessToken } = await service.registerUser(defaultUser);

      const app = createMockApp();
      const serverRequest = createMockServerRequest({
        headerValues: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const context = await createContext(
        new Context(app, serverRequest),
        users,
      );

      assertEquals(context.authenticated, true);
      assertEquals(context.user?._id, user._id);
      assertEquals(context.user?.email, user.email);
      assertEquals(context.user?.name, user.name);
    });
  });
});
