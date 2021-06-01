import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BingoGame } from '@bingo/models';

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

interface GameProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

interface GameInstanceContext {
  game: BingoGame;
  loading: boolean;
  hasGame: boolean;
  getGameInstance: (id: string) => Promise<boolean>;
}

const context = createContext<GameInstanceContext>(undefined);

export const GameInstanceProvider = ({
  children,
  client,
}: GameProviderProps) => {
  const [game, setGame] = useState<BingoGame>(undefined);
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
        setGame(result.data.instance);
        return true;
      })
      .finally(() => setLoading(false));
  };

  return (
    <context.Provider value={{ game, hasGame, loading, getGameInstance }}>
      {children}
    </context.Provider>
  );
};

export const useGameInstanceContext = () => useContext(context);
