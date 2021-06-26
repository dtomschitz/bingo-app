import {
  afterAll,
  assertEquals,
  assertThrowsAsync,
  beforeAll,
  beforeEach,
  describe,
  GQLError,
  it,
} from './test.deps.ts';
import {
  defaultInvalidRequestTest,
  getDatabase,
  defaultRegisterProps,
} from './common.ts';
import { AuthService, UserService } from '../src/service/index.ts';
import { Database, UserDatabase } from '../src/database/index.ts';
import { CreateUserProps, ErrorType } from '../src/models.ts';

import 'https://deno.land/x/dotenv/load.ts';

describe('User', () => {
  let database: Database;
  let users: UserDatabase;
  let service: UserService;
  let authService: AuthService;

  const before = () =>
    beforeAll(async () => {
      database = await getDatabase();
      users = new UserDatabase(database);
      await users.clear();

      service = new UserService(users);
      authService = new AuthService(users);
    });

  const after = () =>
    afterAll(async () => {
      await users.clear();
      database.close();
    });

  const registerDefaultUser = async (props?: CreateUserProps) => {
    const result = await authService.registerUser(
      props ?? defaultRegisterProps,
    );
    return { props: props ?? defaultRegisterProps, result };
  };

  describe('updateUser', () => {
    before();
    after();

    beforeEach(async () => await users.clear());

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.updateUser({
        _id: '',
        changes: {},
      }),
    );

    it('should fail because there is no user stored in the data', async () => {
      await assertThrowsAsync(
        async () =>
          await service.updateUser({
            _id: '60c76e7f7060587fd786decf',
            changes: {},
          }),
        GQLError,
        ErrorType.USER_DOES_NOT_EXIST,
      );
    });

    it('should update the password', async () => {
      const { result } = await registerDefaultUser();

      const user = await service.updateUser({
        _id: result.user._id.toHexString(),
        changes: {
          password: 'NeuesSuperSicheresPasswort#1337#',
        },
      });

      assertEquals(user?._id, result.user._id);
      assertEquals(user?.email, result.user.email);
      assertEquals(user?.name, result.user.name);
    });

    it('should fail because the email is not valid', async () => {
      const { result } = await registerDefaultUser();

      await assertThrowsAsync(
        async () =>
          await service.updateUser({
            _id: result.user._id.toHexString(),
            changes: {
              email: 'testtest.de',
            },
          }),
        GQLError,
        ErrorType.INVALID_EMAIL_FORMAT,
      );
    });

    it('should fail because the email is already used', async () => {
      const { result } = await registerDefaultUser();
      await registerDefaultUser({
        email: 'test2@test.de',
        name: 'Max Mustermann',
        password: 'SuperSicheresPasswort#1337#%',
      });

      await assertThrowsAsync(
        async () =>
          await service.updateUser({
            _id: result.user._id.toHexString(),
            changes: {
              email: 'test2@test.de',
            },
          }),
        GQLError,
        ErrorType.USER_ALREADY_EXISTS,
      );
    });

    it('should update the email', async () => {
      const { result } = await registerDefaultUser();

      const user = await service.updateUser({
        _id: result.user._id.toHexString(),
        changes: {
          email: 'max@mustermann.de',
        },
      });

      assertEquals(user?._id, result.user._id);
      assertEquals(user?.email, 'max@mustermann.de');
      assertEquals(user?.name, result.user.name);
    });

    it('should update multiple parameters', async () => {
      const { result } = await registerDefaultUser();

      const user = await service.updateUser({
        _id: result.user._id.toHexString(),
        changes: {
          email: 'max@musterfrau.de',
          name: 'Max Musterfrau',
        },
      });

      assertEquals(user?._id, result.user._id);
      assertEquals(user?.email, 'max@musterfrau.de');
      assertEquals(user?.name, 'Max Musterfrau');
    });
  });

  describe('deleteUser', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.deleteUser(''),
    );

    it('should fail because there is no user', async () => {
      await assertThrowsAsync(
        async () =>
          await service.updateUser({
            _id: '60c76e7f7060587fd786decf',
            changes: {},
          }),
        GQLError,
        ErrorType.USER_DOES_NOT_EXIST,
      );
    });

    it('should delete the specific user', async () => {
   
    });
  });
});
