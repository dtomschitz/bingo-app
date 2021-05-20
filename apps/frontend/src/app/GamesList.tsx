import { withRouter } from 'react-router';
import { useQuery, gql } from '@apollo/client';
import { BingoGame } from '@bingo/models';
import { BingoPreviewCard } from './components/bingo';
import { GamesListContext } from './services/contexts';
import { useContext, useEffect } from 'react';

const GET_GAMES = gql`
  query GetGames {
    games {
      _id
      title
    }
  }
`;

const GamesList = withRouter(({ history }) => {
  const [gamesList, setGamesList] = useContext(GamesListContext);
  const { error, loading, data } = useQuery<{ games: BingoGame[] }>(GET_GAMES);

  useEffect(() => {
    setGamesList(
      data?.games.map((game, i) => (
        <BingoPreviewCard key={`game-${i}`} game={game} />
      )))
  }, [data])

  return (
    <div className="home">
      {gamesList}
    </div>
  );
});

export default GamesList;

