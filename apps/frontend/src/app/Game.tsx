import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import { useAppBar, useGamesContext, useGameInstanceContext } from './hooks';
import { BingoField, BingoGame } from '@bingo/models'

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

  const games = useGamesContext();

  const[fields, setFields] = useState<string[]>([])

  const onValidateWin = () => {
    
    
    games.validateWin(game._id, fields);

    console.log(game._id);
    
  }

  useEffect(() => {
    getGameInstance(id);
  }, []);

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
          {hasGame && <BingoCard fields={game.fields} onWin={onWin} />}
          <FlatButton className="bingo-button" onClick={() => onValidateWin()} >BINGO</FlatButton>
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
