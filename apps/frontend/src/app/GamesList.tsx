import { useQuery, gql } from '@apollo/client';
import { BingoGame } from '@bingo/models';
import { BingoPreviewCard } from './components/bingo';
import { GamesListContext } from './services/contexts';
import { useContext, useEffect } from 'react';

const GET_GAMES = gql`
  query GetGames {
    games {
      _id,
      title
      instance{
        text
      }
    }
  }
`;

const GamesList = () => {
  const [doRefetch, setDoRefetch] = useContext(GamesListContext);
  const { error, loading, data, refetch } = useQuery<{ games: BingoGame[] }>(GET_GAMES, {
    fetchPolicy: "no-cache"
  });

  const reloadGames = async () => {
    await refetch();
  }

  useEffect(() => {
    if (doRefetch) {
      reloadGames();
      setDoRefetch(false);
    }
  }, [doRefetch])

  return (
    <div className="home">
      {data && data?.games.map((game, i) => (
        <BingoPreviewCard key={`game-${i}`} game={game} />
      ))}
    </div>
  );
};

export default GamesList;

