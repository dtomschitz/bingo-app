import { useEffect } from 'react';
import { gql } from '@apollo/client';
import { RouteComponentProps } from 'react-router';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import { useAppBar, useAuthContext, useGameInstanceContext } from './hooks';

interface GameProps {
  gameId: string;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;

  const appBar = useAppBar();
  const { game, hasGame, loading, getGameInstance } = useGameInstanceContext();

  useEffect(() => {
    getGameInstance(id);
  }, []);

  useEffect(() => appBar.showLoadingBar(loading), [loading]);

  const onWin = () => {
    console.log('Win');

    //TODO: Win Logic
  };

  return (
    <div className="game">
      {!loading && hasGame && <BingoCard fields={game.fields} onWin={onWin} />}
      {!loading && <FlatButton className="bingo-button">BINGO</FlatButton>}
    </div>
  );
};

export default Game;
