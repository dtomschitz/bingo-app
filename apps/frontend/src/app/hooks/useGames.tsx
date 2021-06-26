import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  BingoGame,
  CreateGame,
  UpdateGame,
  FieldMutations,
  GamePhase,
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
  loadGames: () => void;
  createGame: (props: CreateGame) => Promise<void>;
  updateGame: (update: UpdateGame) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  mutateField: (id: string, mutation: FieldMutations) => Promise<boolean>;
  validateWin: (id: string, fieldIds: string[]) => Promise<boolean>;
}

const context = createContext<GamesContext>({
  games: [],
  loadGames: undefined,
  createGame: undefined,
  updateGame: undefined,
  deleteGame: undefined,
  mutateField: undefined,
  validateWin: undefined,
});

export const GamesProvider = ({ children, client }: GamesProviderProps) => {
  const [games, setGames] = useState<BingoGame[]>([]);

  const loadGames = () => {
    client
      .watchQuery<{ games: BingoGame[] }>({
        query: gql(GET_GAMES),
        pollInterval: 1500,
      })
      .subscribe(result => {
        setGames(result.data.games);
      });
  };

  const createGame = async ({ title, fields }: CreateGame) => {
    await client.mutate<{ game: BingoGame[] }>({
      mutation: gql(CREATE_GAME),
      variables: {
        title,
        fields,
        phase: GamePhase.EDITING,
      },
    });
  };

  const updateGame = async (update: UpdateGame) => {
    await client.mutate<{ game: BingoGame[] }>({
      mutation: gql(UPDATE_GAME),
      variables: { update },
    });
  };

  const deleteGame = async (id: string) => {
    await client.mutate<{ deleteGame: boolean }>({
      mutation: gql(DELETE_GAME),
      variables: { id },
    });
  };

  const validateWin = async (id: string, fieldIds: string[]) => {
    try {
      const result = await client.query<{ validateWin: boolean }>({
        query: gql(VALIDATE_WIN),
        variables: {
          id,
          fieldIds,
        },
      });
      return result.data.validateWin;
    } catch {
      return false;
    }
  };

  const mutateField = async (id: string, mutation: FieldMutations) => {
    try {
      const result = await client.mutate<{ mutateField: boolean }>({
        mutation: gql(MUTATE_FIELD),
        variables: { id, mutation },
      });
      return result.data.mutateField;
    } catch {
      return false;
    }
  };

  return (
    <context.Provider
      value={{
        games,
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

export const useGames = () => useContext(context);
