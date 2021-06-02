import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BingoGame, CreateGameProps } from '@bingo/models';

const GET_GAMES = gql`
  query GetGames {
    games {
      _id
      title
      hasInstance
    }
  }
`;

const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $fields: [String!]!) {
    createGame(props: { title: $title, fields: $fields }) {
      _id
      title
      fields {
        _id
        text
      }
    }
  }
`;

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
