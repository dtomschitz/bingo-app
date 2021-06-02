import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BingoGame, ErrorType } from '@bingo/models';

const GET_GAME_INSTANCE = gql`
  query GetGameInstance($id: ID!) {
    instance(_id: $id) {
      _id
      authorId
      title
      fields {
        _id
        text
      }
      hasInstance
    }
  }
`;

const CREATE_GAME_INSTANCE = gql`
  mutation CreateGameInstance($id: ID!) {
    createGameInstance(_id: $id) {
      _id
      authorId
      title
      fields {
        _id
        text
      }
      hasInstance
    }
  }
`;

interface GameProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

interface GameInstanceContext {
  game: BingoGame;
  error: ErrorType;
  loading: boolean;
  hasGame: boolean;
  getGameInstance: (id: string) => Promise<void>;
  createGameInstance: (id: string) => Promise<boolean>;
}

const context = createContext<GameInstanceContext>(undefined);

export const GameInstanceProvider = ({
  children,
  client,
}: GameProviderProps) => {
  const [game, setGame] = useState<BingoGame>(undefined);
  const [error, setError] = useState<ErrorType>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const hasGame = !!game;

  const getGameInstance = (id: string) => {
    setLoading(true);

    return client
      .query<{ instance: BingoGame }>({
        query: GET_GAME_INSTANCE,
        variables: { id },
        fetchPolicy: 'no-cache',
      })
      .then(result => {
        const game = result.data.instance;
        setGame(game);
      })
      .catch(({ message }) => setError(message as ErrorType))
      .finally(() => setLoading(false));
  };

  const createGameInstance = (id: string) => {
    setLoading(true);
    return client
      .mutate<{ createGameInstance: BingoGame }>({
        mutation: CREATE_GAME_INSTANCE,
        variables: { id },
      })
      .then(() => true)
      .catch(({ message }) => {
        setError(message as ErrorType);
        return true;
      })
      .finally(() => setLoading(false));
  };

  return (
    <context.Provider
      value={{
        game,
        error,
        hasGame,
        loading,
        getGameInstance,
        createGameInstance,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useGameInstanceContext = () => useContext(context);
