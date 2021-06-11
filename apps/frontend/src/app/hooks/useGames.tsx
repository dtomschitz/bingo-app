import { createContext, ReactNode, useContext, useState } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  BingoGame,
  CreateGame,
  UpdateGame,
  FieldMutations,
} from '@bingo/models';
import {
  GET_GAMES,
  CREATE_GAME,
  UPDATE_GAME,
  DELETE_GAME,
  MUTATE_FIELD,
} from '@bingo/gql';

interface GamesProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

interface GamesContext {
  games: BingoGame[];
  loading: boolean;
  loadGames: () => Promise<boolean>;
  createGame: (props: CreateGame) => Promise<boolean>;
  updateGame: (update: UpdateGame) => Promise<boolean>;
  deleteGame: (id: string) => Promise<boolean>;
  mutateField: (id: string, mutation: FieldMutations) => Promise<boolean>;
}

const context = createContext<GamesContext>({
  games: [],
  loading: false,
  loadGames: undefined,
  createGame: undefined,
  updateGame: undefined,
  deleteGame: undefined,
  mutateField: undefined,
});

export const GamesProvider = ({ children, client }: GamesProviderProps) => {
  const [games, setGames] = useState<BingoGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadGames = () => {
    setLoading(true);
    return client
      .query<{ games: BingoGame[] }>({
        query: GET_GAMES,
        fetchPolicy: 'no-cache',
      })
      .then(result => {
        setGames(result.data.games);
        return true;
      })
      .finally(() => setLoading(false));
  };

  const createGame = ({ title, fields }: CreateGame) => {
    return client
      .mutate<{ game: BingoGame[] }>({
        mutation: CREATE_GAME,
        variables: {
          title,
          fields,
          phase: "editing"
        },
      })
      .then(() => {
        loadGames();
        return true;
      });
  };

  const updateGame = (update: UpdateGame) => {
    return client
      .mutate<{ game: BingoGame[] }>({
        mutation: UPDATE_GAME,
        variables: {
          update,
        },
      })
      .then(() => {
        loadGames();
        return true;
      })
      .catch(e => {
        return false;
      });
  };

  const deleteGame = (id: string) => {
    return client
      .mutate<{ deleteGame: boolean }>({
        mutation: DELETE_GAME,
        variables: { id },
      })
      .then(() => {
        loadGames();
        return true;
      })
      .catch(() => false);
  };

  const mutateField = (id: string, mutation: FieldMutations) => {
    return client
      .mutate<{ mutateField: boolean }>({
        mutation: MUTATE_FIELD,
        variables: { id, mutation },
      })
      .then(result => {
        loadGames();
        return result.data.mutateField;
      })
      .catch(e => {
        console.log(e);
        return false;
      });
  };

  return (
    <context.Provider
      value={{
        games,
        loading,
        loadGames,
        createGame,
        updateGame,
        deleteGame,
        mutateField,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useGamesContext = () => useContext(context);
