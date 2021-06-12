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
  const [fields, setFields] = useState<string[]>([]);

  const onValidateWin = () => {
    games.validateWin(game._id, fields);

    console.log(game._id);
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

  const onWin = (fields: BingoField[]) => {
    console.log('Win');
    const selectedFields = fields
      .filter(field => field.isSelected)
      .map(field => field._id);
    setFields(selectedFields);
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      {!loading && (
        <>
          <AdminControls />
          {hasGame && <BingoCard {...card} />}
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
