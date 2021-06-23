import {
  afterAll,
  assertEquals,
  assertExists,
  assertThrowsAsync,
  beforeAll,
  describe,
  GQLError,
  it,
  superoak,
  SuperDeno,
} from './test.deps.ts';
import { defaultInvalidRequestTest, getDatabase } from './common.ts';
import { WebSocket } from '../src/deps.ts';
import app from '../src/main.ts';
import { AuthService } from '../src/service/index.ts';
import { Database, UserDatabase } from '../src/database/index.ts';
import { CreateUserProps, ErrorType, RegisterProps } from '../src/models.ts';

describe('Game WebSocket', () => {
  let oakApp: SuperDeno;
  let socket: WebSocket;

  beforeAll(async () => {
    oakApp = await superoak(app);
  });

  afterAll(() => {

  });

  it('should upgrade the connection and connect to the web socket', () => {
    //const wss = new We
  });
});
