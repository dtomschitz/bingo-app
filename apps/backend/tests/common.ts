import { assertThrowsAsync, GQLError, it, v4 } from './test.deps.ts';
import { Application, State, ServerRequest } from '../src/deps.ts';
import { BingoField, ErrorType, User, CreateUserProps } from '../src/models.ts';
import { Database } from '../src/database/index.ts';

export const defaultUser: User = {
  _id: '60c336ddc68379bceaf6b3c5',
  email: 'test@test.de',
  name: 'Max Mustermann',
  password: 'SuperSicheresPasswort#1337###',
};

export const defaultRegisterProps: CreateUserProps = {
  email: 'test@test.de',
  name: 'Max Mustermann',
  password: 'SuperSicheresPasswort#1337#%',
};

export const createMockApp = <S extends State = Record<string, any>>(
  state = {} as S,
): Application<S> => {
  return {
    state,
    dispatchEvent() {},
  } as any;
};

interface MockServerRequestOptions {
  url?: string;
  host?: string;
  body?: string;
  headerValues?: Record<string, string>;
  proto?: string;
  conn?: {
    remoteAddr: {
      hostname: string;
    };
  };
}

const encoder = new TextEncoder();
export const createMockBodyReader = (body: string): Deno.Reader => {
  const buf = encoder.encode(body);
  let offset = 0;
  return {
    read(p: Uint8Array): Promise<number | null> {
      if (offset >= buf.length) {
        return Promise.resolve(null);
      }
      const chunkSize = Math.min(p.length, buf.length - offset);
      p.set(buf);
      offset += chunkSize;
      return Promise.resolve(chunkSize);
    },
  };
};

export const createMockServerRequest = ({
  url = '/',
  host = 'localhost',
  body,
  headerValues = {},
  proto = 'HTTP/1.1',
}: MockServerRequestOptions = {}): ServerRequest => {
  const headers = new Headers();
  headers.set('host', host);
  for (const [key, value] of Object.entries(headerValues)) {
    headers.set(key, value);
  }
  if (body && body.length && !headers.has('content-length')) {
    headers.set('content-length', String(body.length));
  }
  return {
    headers,
    method: 'GET',
    url,
    proto,
    body: body && createMockBodyReader(body),
    async respond() {},
    // deno-lint-ignore no-explicit-any
  } as any;
};

export const getDatabase = async (options?: {
  name?: string;
  url?: string;
  user?: string;
  password?: string;
}) => {
  const databaseUser = options?.user ?? Deno.env.get('DATABASE_USER');
  const databasePassword =
    options?.password ?? Deno.env.get('DATABASE_PASSWORD');

  const database = new Database(
    options?.name ?? 'saturn_testing',
    options?.url ?? (!databaseUser || !databasePassword)
      ? `mongodb://database:27017`
      : `mongodb://${databaseUser}:${databasePassword}@database:27017`,
  );

  await database.connect();
  return database;
};

export const defaultInvalidRequestTest = <T>(
  name: string,
  fn: () => Promise<T>,
) => {
  return it(name, async () => {
    await assertThrowsAsync(
      async () => await fn(),
      GQLError,
      ErrorType.INCORRECT_REQUEST,
    );
  });
};

export const generateBingoFields = (length?: number) => {
  return Array.from({ length: length ?? 40 }).map<BingoField>((_, index) => ({
    _id: v4.generate(),
    text: `Field ${index}`,
    checked: false,
  }));
};
