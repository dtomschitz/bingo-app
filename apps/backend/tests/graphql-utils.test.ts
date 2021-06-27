import {
  afterAll,
  assertEquals,
  beforeEach,
  beforeAll,
  describe,
  it,
} from './test.deps.ts';
import {
  createMockApp,
  createMockServerRequest,
  getDatabase,
  defaultRegisterProps,
} from './common.ts';
import { Context } from '../src/deps.ts';
import { createContext } from '../src/utils/index.ts';
import { AuthService } from '../src/service/index.ts';
import { Database, UserDatabase } from '../src/database/index.ts';
import { CreateUserProps } from '../src/models.ts';

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

    beforeEach(async () => await users.clear());

    const registerDefaultUser = async (props?: CreateUserProps) => {
      const result = await service.registerUser(props ?? defaultRegisterProps);
      return { props: props ?? defaultRegisterProps, result };
    };

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
      const {
        result: { user },
      } = await registerDefaultUser();
      await users.deleteUser(user._id);

      const app = createMockApp();
      const serverRequest = createMockServerRequest({
        headerValues: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const context = await createContext(
        new Context(app, serverRequest),
        users,
      );

      assertEquals(context.authenticated, false);
      assertEquals(context.user, undefined);
    });
  });
});
