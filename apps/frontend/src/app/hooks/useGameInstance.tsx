import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_GAME_INSTANCE, CREATE_GAME_INSTANCE } from '@bingo/gql';
import { BingoField, BingoGame, ErrorType } from '@bingo/models';

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
  updateGameInstance: (fn: (game: BingoGame) => Partial<BingoGame>) => void;
  updateGameField: (id: string, changes: Partial<BingoField>) => void;
}

const context = createContext<GameInstanceContext>({
  game: undefined,
  error: undefined,
  loading: false,
  hasGame: false,
  getGameInstance: undefined,
  createGameInstance: undefined,
  updateGameInstance: undefined,
  updateGameField: undefined,
});

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
    setGame(undefined);

    return client
      .query<{ instance: BingoGame }>({
        query: gql(GET_GAME_INSTANCE),
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
        mutation: gql(CREATE_GAME_INSTANCE),
        variables: { id },
      })
      .then(() => true)
      .catch(({ message }) => {
        setError(message as ErrorType);
        return true;
      })
      .finally(() => setLoading(false));
  };

  const updateGameInstance = (fn: (game: BingoGame) => Partial<BingoGame>) => {
    setGame(game => ({ ...game, ...fn(game) }));
  };

  const updateGameField = (id: string, changes: Partial<BingoField>) => {
    updateGameInstance(game => ({
      fields: game.fields.map(field => {
        return field._id === id ? { ...field, ...changes } : field;
      }),
    }));
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
        updateGameInstance,
        updateGameField,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useGameInstance = () => useContext(context);
