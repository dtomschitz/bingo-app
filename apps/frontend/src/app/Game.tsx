import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import toast from 'react-hot-toast';
import { BingoField, GameEvent, GameEventType } from '@bingo/models';
import { BingoCard } from './components/bingo';
import { Card, CardTitle, FlatButton, Collapsible } from './components/common';
import {
  useAppBar,
  useAuthContext,
  useGameInstanceContext,
  useGameSocket,
} from './hooks';

interface GameProps {
  gameId: string;
}

interface AdminControlProps {
  onDrawNewField: () => void;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;
  const appBar = useAppBar();
  const auth = useAuthContext();

  const [currentField, setCurrentField] = useState<BingoField>();

  const handleGameEvent = (event: GameEvent) => {
    if (event.type === GameEventType.UNAUTHORIZED) {
      toast.error('Unautorisierter Zugriff');
    } else if (event.type === GameEventType.NEW_FIELD_DRAWN) {
      toast('Es wurde ein neues Feld gezogen!', { icon: '🃏' });
      setCurrentField(event.data.field);
    }
  };

  const {
    game,
    error,
    hasGame,
    loading,
    getGameInstance,
  } = useGameInstanceContext();
  const { sendEvent, state } = useGameSocket({
    id,
    onMessage: handleGameEvent,
  });

  useEffect(() => {
    getGameInstance(id);
  }, []);

  useEffect(() => appBar.showLoadingBar(loading), [appBar, loading]);

  const onDrawNewField = () => sendEvent(GameEventType.DRAW_FIELD);
  const onWin = () => sendEvent(GameEventType.ON_WIN);

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      <span>The WebSocket is currently {state}</span>

      {!loading && (
        <>
          {hasGame && auth.user?._id === game.authorId && (
            <AdminControls onDrawNewField={onDrawNewField} />
          )}
          {!!currentField && (
            <Card className="current-field">
              <CardTitle>Aufgedecktes Feld: {currentField.text}</CardTitle>
            </Card>
          )}
          {hasGame && <BingoCard fields={game.instanceFields} onWin={onWin} />}
          <FlatButton className="bingo-button">BINGO</FlatButton>
          <Collapsible trigger="Bingo Felder">Test</Collapsible>
        </>
      )}
    </div>
  );
};

const AdminControls = ({ onDrawNewField }: AdminControlProps) => {
  return (
    <div className="admin-controls">
      <h1>Admin Panel</h1>
      <FlatButton className="bingo-button" onClick={onDrawNewField}>
        Draw Field
      </FlatButton>
    </div>
  );
};

export default Game;
