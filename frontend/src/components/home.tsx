import { withRouter } from 'react-router';
import { BingoField, BingoGame } from '../../../lib/models';
import { BingoPreviewCard } from './bingo/BingoPreviewCard';
import { v4 as uuidv4 } from 'uuid';

const fields: BingoField[] = Array.from({ length: 25 }, () => ({
  id: uuidv4(),
  text: 'Test',
  isSelected: false,
}));

const dummyGames: BingoGame[] = [
  {
    _id: uuidv4(),
    title: 'Spiel 1',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 2',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
  {
    _id: uuidv4(),
    title: 'Spiel 3',
    fields,
  },
];

/*const Home = () => {
  const openBingoGame = (game: BingoGame) => {};

  return (
    <div className="home">
      {dummyGames.map(game => (
        <BingoPreviewCard
          game={game}
          onClick={() => onBingoTileClick(25 - index, field)}
        />
      ))}
    </div>
  );
};*/

const Home = withRouter(({ history }) => {

  
  return (
    <div className="home">
      {dummyGames.map(game => (
        <BingoPreviewCard
          game={game}
          onClick={() => history.push(`game/${game._id}`)}
        />
      ))}
    </div>
  );
});

export default Home;
