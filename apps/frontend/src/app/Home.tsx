import { withRouter } from 'react-router';
import { useQuery, gql } from '@apollo/client';
import { BingoGame } from '@bingo/models';
import { BingoPreviewCard } from './components/bingo';

const GET_GAMES = gql`
  query GetGames {
    games {
      _id
      title
      fields {
        _id
        text
      }
    }
  }
`;

const Home = withRouter(({ history }) => {
  const { error, loading, data } = useQuery<{ games: BingoGame[] }>(GET_GAMES);

  const openGame = (game: BingoGame) => {
    history.push(`/game/${game._id}`);
  };

  return (
    <div className="home">
      {data?.games.map(game => (
        <BingoPreviewCard game={game} onClick={() => openGame(game)} />
      ))}
    </div>
  );
});

export default Home;
