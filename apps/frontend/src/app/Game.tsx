import { CSSProperties, useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import toast from 'react-hot-toast';
import {
  BingoField,
  BingoGame,
  ConnectionState,
  errorMessages,
  GameEvent,
  GameEventType,
  getConnectionStateMessage,
} from '@bingo/models';
import { BingoCard } from './components/bingo';
import {
  Badge,
  Card,
  CardTitle,
  FlatButton,
  Collapsible,
  CardActions,
  CardHeader,
} from './components/common';
import {
  useAppBar,
  useAuthContext,
  useGameInstanceContext,
  useGameSocket,
} from './hooks';

interface GameProps {
  gameId: string;
}

interface CurrentFieldProps {
  field?: BingoField;
}

interface AdminControlProps {
  state: ConnectionState;
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
    } else if (event.type === GameEventType.PLAYER_LEFT) {
      toast('Ein Spieler hat das Spiel verlassen', { icon: '🚶' });
    } else if (event.type === GameEventType.PLAYER_JOINED) {
      toast('Ein Spieler ist dem Spiel beigetreten', { icon: '👋' });
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
      {!loading && hasGame && (
        <>
          {auth.user?._id === game.authorId && (
            <AdminControls state={state} onDrawNewField={onDrawNewField} />
          )}
          <CurrentField field={currentField} />
          {<BingoCard fields={game.instanceFields} onWin={onWin} />}
          <FlatButton className="bingo-button">BINGO</FlatButton>
          <BingoFieldsCollapsible {...game} />
        </>
      )}
    </div>
  );
};

const CurrentField = ({ field }: CurrentFieldProps) => {
  const [show, setShow] = useState(false);
  const updateTimer = useRef(null);

  useEffect(() => {
    setShow(false);

    updateTimer.current = setTimeout(() => {
      setShow(true);
    }, 150);
  }, [field]);

  const style: CSSProperties = {
    opacity: show ? 1 : 0,
    transition: 'all 150ms ease-in',
  };

  return (
    <Card className="current-field" style={style}>
      <CardTitle>
        {field
          ? `Aufgedecktes Feld: ${field?.text}`
          : 'Es wurde noch kein Feld aufgedeckt'}
      </CardTitle>
    </Card>
  );
};

const BingoFieldsCollapsible = (game: BingoGame) => {
  return (
    <Collapsible trigger="Bingo Felder" className="bingo-fields">
      {game.instanceFields.map(field => (
        <div key={field._id} className="bingo-field-item">
          <span>{field.text}</span>
        </div>
      ))}
    </Collapsible>
  );
};

const AdminControls = ({ state, onDrawNewField }: AdminControlProps) => {
  return (
    <Card className="admin-controls">
      <CardHeader>
        <CardTitle>Admin Controls</CardTitle>
        <Badge
          text={getConnectionStateMessage(state)}
          className={state.toLowerCase()}
        />
      </CardHeader>
      <CardActions>
        <FlatButton className="draw-field" onClick={onDrawNewField}>
          Feld aufdecken
        </FlatButton>
      </CardActions>
    </Card>
  );
};

export default Game;
