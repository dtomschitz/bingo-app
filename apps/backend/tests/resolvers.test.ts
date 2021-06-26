import {
  assertExists,
  assertEquals,
  describe,
  beforeEach,
  afterEach,
  it,
  superoak,
} from './test.deps.ts';
import { getDatabase } from './common.ts';
import { Database, UserDatabase, GameDatabase } from '../src/database/index.ts';
import {
  REGISTER_USER,
  USER_LOGIN,
  USER_LOGOUT,
  VERIFY_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_GAME,
  UPDATE_GAME,
  DELETE_GAME,
} from '../src/gql.ts';
import { GamePhase } from '../src/models.ts';
import { Application } from '../src/deps.ts';
import createApp from '../src/app.ts';

import 'https://deno.land/x/dotenv/load.ts';

describe('Resolvers', () => {
  let database: Database;
  let app: Application;

  beforeEach(async () => {
    database = await getDatabase();

    app = await createApp({
      database: {
        user: {
          instance: new UserDatabase(database),
          clearOnConnect: true,
        },
        game: {
          instance: new GameDatabase(database),
          clearOnConnect: true,
        },
      },
    });
  });

  afterEach(() => {
    database.close();
  });

  const registerUser = async () => {
    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'UserRegister',
      query: REGISTER_USER,
      variables: {
        name: 'Max Mustermann',
        email: 'test@test.de',
        password: 'SuperSicheresPasswort#1337###',
      },
    });

    return response.body.data.registerUser;
  };

  const createGame = async (accessToken: string) => {
    const request = await superoak(app);
    const response = await request
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: 'CreateGame',
        query: CREATE_GAME,
        variables: {
          title: 'Test Game',
          fields: Array.from({ length: 30 }).map(
            (_, index) => `Field ${index}`,
          ),
        },
      });

    return response.body.data.createGame;
  };

  it('should register the new user', async () => {
    const { user, accessToken, refreshToken } = await registerUser();

    assertExists(user._id);
    assertExists(accessToken);
    assertExists(refreshToken);
    assertEquals(user.name, 'Max Mustermann');
    assertEquals(user.email, 'test@test.de');
  });

  it('should login the user', async () => {
    const { user } = await registerUser();

    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'UserLogin',
      query: USER_LOGIN,
      variables: {
        email: user.email,
        password: 'SuperSicheresPasswort#1337###',
      },
    });

    const result = response.body.data.loginUser;
    assertExists(result.user._id);
    assertExists(result.accessToken);
    assertExists(result.refreshToken);
    assertEquals(result.user.name, 'Max Mustermann');
    assertEquals(result.user.email, 'test@test.de');
  });

  it('should verify the user', async () => {
    const { refreshToken } = await registerUser();

    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'VerifyUser',
      query: VERIFY_USER,
      variables: { refreshToken },
    });

    const user = response.body.data.verifyUser;
    assertExists(user._id);
    assertEquals(user.name, 'Max Mustermann');
    assertEquals(user.email, 'test@test.de');
  });

  it('should logout the user', async () => {
    const { user } = await registerUser();

    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'UserLogout',
      query: USER_LOGOUT,
      variables: { email: user.email },
    });

    assertEquals(response.body.data.logoutUser, true);
  });

  it('should update a user', async () => {
    const { user } = await registerUser();

    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'UpdateUser',
      query: UPDATE_USER,
      variables: {
        update: {
          _id: user._id,
          changes: {
            name: 'Max Mustermann',
            email: 'max@musterfrau.de',
          },
        },
      },
    });

    const updatedUser = response.body.data.updateUser;
    assertExists(updatedUser._id);
    assertEquals(updatedUser.name, 'Max Mustermann');
    assertEquals(updatedUser.email, 'max@musterfrau.de');
  });

  it('should delete a user', async () => {
    const { user } = await registerUser();

    const request = await superoak(app);
    const response = await request.post('/graphql').send({
      operationName: 'DeleteUser',
      query: DELETE_USER,
      variables: { id: user._id },
    });

    assertEquals(response.body.data.deleteUser, true);
  });

  it('should create a game', async () => {
    const { accessToken } = await registerUser();
    const game = await createGame(accessToken);

    assertExists(game._id);
    assertEquals(game.title, 'Test Game');
    assertEquals(game.phase, GamePhase.EDITING);
    assertEquals(game.fields.length, 30);
  });

  it('should update a game', async () => {
    const { accessToken } = await registerUser();
    const { _id } = await createGame(accessToken);

    const request = await superoak(app);
    const response = await request
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: 'UpdateGame',
        query: UPDATE_GAME,
        variables: {
          update: {
            _id,
            changes: {
              title: 'New Test Game',
              phase: GamePhase.OPEN,
            },
          },
        },
      });    

    const game = response.body.data.updateGame;

    assertExists(game._id);
    assertEquals(game.title, 'New Test Game');
    assertEquals(game.phase, GamePhase.OPEN);
    assertEquals(game.fields.length, 30);
  });

  it('should delete a game', async () => {
    const { accessToken } = await registerUser();
    const game = await createGame(accessToken);

    const request = await superoak(app);
    const response = await request
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: 'DeleteGame',
        query: DELETE_GAME,
        variables: { id: game._id },
      });

    assertEquals(response.body.data.deleteGame, true);
  });
});
