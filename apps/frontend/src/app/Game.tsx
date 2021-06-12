import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { BingoField } from '@bingo/models';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import {
  useAppBar,
  useGamesContext,
  useBingoCard,
  useGameInstanceContext,
} from './hooks';

interface GameProps {
  gameId: string;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;

  const appBar = useAppBar();
  const {
    game,
    error,
    hasGame,
    loading,
    getGameInstance,
  } = useGameInstanceContext();

  const card = useBingoCard();
  const games = useGamesContext();

  const onValidateWin = () => {
    const selectedFields = card.fields
      .filter(field => field.isSelected)
      .map(field => field._id);

    games.validateWin(game._id, selectedFields);
  };

  useEffect(() => {
    getGameInstance(id).then();
  }, []);

  useEffect(() => {
    if (game) {
      card.setInitialFields(game.fields);
    }
  }, [game]);

  useEffect(() => appBar.showLoadingBar(loading), [appBar, loading]);

  const onWin = () => {
    console.log('Win');
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      {!loading && (
        <>
          <AdminControls />
          {hasGame && <BingoCard {...card} onWin={onWin} />}
          <FlatButton className="bingo-button" onClick={() => onValidateWin()}>
            BINGO
          </FlatButton>
        </>
      )}
    </div>
  );
};

const AdminControls = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
};

export default Game;
