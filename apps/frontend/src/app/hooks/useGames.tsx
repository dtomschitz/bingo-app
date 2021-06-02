import { createContext, ReactNode, useContext, useState } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BingoGame, CreateGameProps } from '@bingo/models';
import { GET_GAMES, CREATE_GAME } from '@bingo/gql';

interface GamesProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

interface GamesContext {
  games: BingoGame[];
  loading: boolean;
  loadGames: () => Promise<boolean>;
  createGame: (props: CreateGameProps) => Promise<boolean>;
}

const context = createContext<GamesContext>(undefined);

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

  const createGame = ({ title, fields }: CreateGameProps) => {
    return client
      .mutate<{ game: BingoGame[] }>({
        mutation: CREATE_GAME,
        variables: {
          title,
          fields,
        },
      })
      .then(() => {
        loadGames();
        return true;
      });
  };

  return (
    <context.Provider
      value={{
        games,
        loading,
        loadGames,
        createGame,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useGamesContext = () => useContext(context);
