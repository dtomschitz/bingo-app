import { createContext, ReactNode, useContext, useState } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  BingoGame,
  CreateGame,
  UpdateGame,
  FieldMutations,
  BingoField,
} from '@bingo/models';
import {
  GET_GAMES,
  CREATE_GAME,
  UPDATE_GAME,
  DELETE_GAME,
  MUTATE_FIELD,
  VALIDATE_WIN,
} from '@bingo/gql';

interface GamesProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

interface GamesContext {
  games: BingoGame[];
  loading: boolean;
  loadGames: () => ZenObservable.Subscription;
  createGame: (props: CreateGame) => Promise<boolean>;
  updateGame: (update: UpdateGame) => Promise<boolean>;
  deleteGame: (id: string) => Promise<boolean>;
  mutateField: (id: string, mutation: FieldMutations) => Promise<boolean>;
  validateWin: (id: string, fieldIds: string[]) => Promise<boolean>;
}

const context = createContext<GamesContext>({
  games: [],
  loading: false,
  loadGames: undefined,
  createGame: undefined,
  updateGame: undefined,
  deleteGame: undefined,
  mutateField: undefined,
  validateWin: undefined,
});

export const GamesProvider = ({ children, client }: GamesProviderProps) => {
  const [games, setGames] = useState<BingoGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadGames = () => {
    return client
      .watchQuery<{ games: BingoGame[] }>({
        query: GET_GAMES,
        pollInterval: 1500,
      })
      .subscribe(result => {
        setGames(result.data.games);
      });
  };

  const createGame = ({ title, fields }: CreateGame) => {
    return client
      .mutate<{ game: BingoGame[] }>({
        mutation: CREATE_GAME,
        variables: {
          title,
          fields,
          phase: 'editing',
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

  const validateWin = (id: string, fieldIds: string[]) => {
    return client
      .query<{ validateGame: boolean }>({
        query: VALIDATE_WIN,
        variables: {
          id,
          fieldIds,
        },
      })
      .then((res: any) => {
        loadGames();
        return res.data?.validateWin;
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
        validateWin,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useGamesContext = () => useContext(context);
