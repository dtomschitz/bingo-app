import { gql } from '@apollo/client';
import { createMockClient } from 'mock-apollo-client';
import { v4 as uuid } from 'uuid';
import { USER_LOGIN } from '@bingo/gql';
import { AuthResult, BingoGame, GamePhase } from '@bingo/models';

export const defaultUser = {
  _id: uuid(),
  name: 'Max Mustermann',
  email: 'test@test.de',
  password: 'SuperSicheresPasswort#1337#%',
};

export const generateMockedGame = (): BingoGame => {
  return {
    _id: uuid(),
    authorId: defaultUser._id,
    title: 'Test Game',
    fields: Array.from({ length: 30 }).map(() => ({
      _id: uuid(),
      text: 'Field',
      checked: false,
    })),
    phase: GamePhase.EDITING,
    hasInstance: false,
  };
};

export const generateMockedAuthResult = (): AuthResult => {
  return {
    user: defaultUser,
    accessToken: '...',
    refreshToken: '...',
  };
};

export const createDefaultMockClient = () => {
  const client = createMockClient();
  client.setRequestHandler(gql(USER_LOGIN), () =>
    Promise.resolve({ data: { loginUser: generateMockedAuthResult() } }),
  );

  return client;
};
