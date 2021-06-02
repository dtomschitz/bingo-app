import { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import { useAppBar, useGameInstanceContext } from './hooks';

interface GameProps {
  gameId: string;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;

  const history = useHistory();
  const appBar = useAppBar();
  const {
    game,
    error,
    hasGame,
    loading,
    getGameInstance,
  } = useGameInstanceContext();

  useEffect(() => {
    getGameInstance(id);
  }, []);

  useEffect(() => appBar.showLoadingBar(loading), [appBar, loading]);

  const onWin = () => {
    console.log('Win');

    //TODO: Win Logic
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      {!loading && hasGame && <BingoCard fields={game.fields} onWin={onWin} />}
      {!loading && <FlatButton className="bingo-button">BINGO</FlatButton>}
    </div>
  );
};

export default Game;
