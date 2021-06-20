import { useEffect, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  BingoField,
  BingoGame,
  BingoInstanceField,
  ConnectionState,
  ErrorType,
  GameEvent,
  GameEventType,
  GamePhase,
  getConnectionStateMessage,
  Player,
} from '@bingo/models';
import {
  Badge,
  Card,
  CardTitle,
  FlatButton,
  Collapsible,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
} from './components/common';
import { BingoCard } from './components/bingo';
import {
  useAppBar,
  useAuthContext,
  useBingoCard,
  useGameInstanceContext,
  useGamesContext,
  useGameSocket,
} from './hooks';

interface GameProps {
  gameId: string;
}

interface BingoFieldProps {
  fields: BingoInstanceField[];
}

interface BottomInfoBarProps {
  field?: BingoField;
  game: BingoGame;
  onValidateWin: () => void;
}

interface AdminControlProps {
  game: BingoGame;
  players: Player[];
  state: ConnectionState;
  onDrawNewField: () => void;
  onCloseGame: () => void;
  onStartGame: () => void;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;

  const history = useHistory();
  const appBar = useAppBar();
  const auth = useAuthContext();

  const {
    game,
    error,
    hasGame,
    loading,
    getGameInstance,
    updateGameField,
  } = useGameInstanceContext();

  const card = useBingoCard();
  const games = useGamesContext();

  const [currentField, setCurrentField] = useState<BingoField>(undefined);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  const { sendEvent, state } = useGameSocket({
    id,
    onMessage: (event: GameEvent) => {
      if (event.type === GameEventType.UNAUTHORIZED) {
        toast.error('Unautorisierter Zugriff');
      } else if (event.type === GameEventType.PLAYER_LEFT) {
        toast('Ein Spieler hat das Spiel verlassen', { icon: '🚶' });
        setCurrentPlayers(event.data?.players ?? []);
      } else if (event.type === GameEventType.PLAYER_JOINED) {
        toast('Ein Spieler ist dem Spiel beigetreten', { icon: '👋' });
        setCurrentPlayers(event.data?.players ?? []);
      } else if (event.type === GameEventType.GAME_JOINED) {
        toast('Du bist dem Spiel beigetreten', { icon: '👋' });
        setCurrentPlayers(event.data?.players ?? []);
      } else if (event.type === GameEventType.NEW_FIELD_DRAWN) {
        const field = event.data.field as BingoField;

        toast('Es wurde ein neues Feld gezogen!', { icon: '🃏' });
        setCurrentField(field);
        updateGameField(field._id, { checked: true });
      } else if (event.type === GameEventType.NO_MORE_FIELDS) {
        toast.error('Es können keine weiteren Felder gezogen werden!');
      } else if (event.type === GameEventType.GAME_CLOSED) {
        toast('Das Spiel wurde vom Admin beendet!', { icon: '❌' });
        history.replace('/');
      } else if (event.type === GameEventType.GAME_STARTED) {
        toast('Das Spiel wurde gestartet!', { icon: '✅' });
        game.phase = GamePhase.PLAYING;
      }
    },
  });

  useEffect(() => {
    getGameInstance(id).then();
  }, []);

  useEffect(() => {
    if (game) {
      card.setInitialFields(game.instanceFields);
    }
  }, [game]);

  useEffect(() => {
    if (error === ErrorType.GAME_NOT_FOUND) {
      history.push('/');
    }
  }, [history, error]);

  useEffect(() => appBar.showLoadingBar(loading), [appBar, loading]);

  const onDrawNewField = () => sendEvent(GameEventType.DRAW_FIELD);
  const onCloseGame = () => sendEvent(GameEventType.CLOSE_GAME);
  const onStartGame = () => sendEvent(GameEventType.START_GAME);
  const onWin = () => sendEvent(GameEventType.ON_WIN);

  const onValidateWin = () => {
    const selectedFields = card.fields
      .filter(field => field.selected)
      .map(field => field._id);

    games.validateWin(game._id, selectedFields);
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      {!loading && hasGame && (
        <>
          <div className="game-container">
            {auth.user?._id === game.authorId && (
              <AdminControls
                game={game}
                players={currentPlayers}
                state={state}
                onCloseGame={onCloseGame}
                onStartGame={onStartGame}
                onDrawNewField={onDrawNewField}
              />
            )}
            <BingoCardHeader />
            <BingoCard {...card} onWin={onWin} />
            <BingoFields fields={game.instanceFields} />
          </div>
          <BottomInfoBar
            field={currentField}
            game={game}
            onValidateWin={onValidateWin}
          />
        </>
      )}
    </div>
  );
};

const BingoCardHeader = () => {
  return (
    <div className="bingo-card-header">
      <div className="letter">B</div>
      <div className="letter">I</div>
      <div className="letter">N</div>
      <div className="letter">G</div>
      <div className="letter">O</div>
    </div>
  );
};

const BingoFields = ({ fields }: BingoFieldProps) => {
  return (
    <Collapsible trigger="Deine Felder" defaultOpen={true}>
      {fields.map((field, index) => (
        <div className="list-item">
          <span className="id">{index + 1}: </span>
          <span className="text">{field.text}</span>
        </div>
      ))}
    </Collapsible>
  );
};

const BottomInfoBar = ({ field, onValidateWin }: BottomInfoBarProps) => {
  return (
    <div className="bottom-info-bar elevation-z8">
      <Card className="current-field">
        <CardTitle>
          {field
            ? `Aufgedecktes Feld: ${field?.text}`
            : 'Es wurde noch kein Feld aufgedeckt'}
        </CardTitle>
      </Card>
      <FlatButton className="bingo-button" onClick={onValidateWin}>
        BINGO
      </FlatButton>
    </div>
  );
};

const AdminControls = ({
  game,
  players,
  state,
  onCloseGame,
  onStartGame,
  onDrawNewField,
}: AdminControlProps) => {
  const auth = useAuthContext();

  const uncheckedFields = game.fields.filter(field => !field.checked);
  const checkedFields = game.fields.filter(field => field.checked);

  return (
    <Card className="admin-controls">
      <CardHeader>
        <CardTitle>Admin Controls</CardTitle>
        <Badge
          text={getConnectionStateMessage(state)}
          className={state.toLowerCase()}
        />
      </CardHeader>
      <CardContent>
        <Collapsible
          trigger={`Bingo Felder (${uncheckedFields.length}/${checkedFields.length})`}
          className="bingo-fields"
        >
          <h2 className="label">
            Nicht aufgedeckte Felder
            <span className="count">({uncheckedFields.length})</span>
          </h2>
          <Divider />
          {uncheckedFields.map(field => (
            <div key={field._id} className="list-item">
              <span>{field.text}</span>
            </div>
          ))}
          <h2 className="label">
            Aufgedeckte Felder
            <span className="count">({checkedFields.length})</span>
          </h2>
          <Divider />
          {checkedFields.map(field => (
            <div key={field._id} className="list-item">
              <FontAwesomeIcon className="check-icon" icon={faCheck} />
              <span>{field.text}</span>
            </div>
          ))}
        </Collapsible>
        <Collapsible trigger={`Spieler (${players.length})`}>
          {players.map(player => (
            <div key={player._id} className="list-item">
              <span>
                {player.name}
                {auth.user?._id === player._id && <span> (Du)</span>}
              </span>
            </div>
          ))}
        </Collapsible>
      </CardContent>
      <CardActions>
        {game.phase === GamePhase.PLAYING ? (
          <div>
            {uncheckedFields.length === 0 && (
              <div className="info">
                <span>Es wurden alle Felder aufgedeckt!</span>
              </div>
            )}

            {uncheckedFields.length === 0 ? (
              <FlatButton className="warning" onClick={onCloseGame}>
                Spiel beenden
              </FlatButton>
            ) : (
              <FlatButton onClick={onDrawNewField}>Feld aufdecken</FlatButton>
            )}
          </div>
        ) : (
          game.phase === GamePhase.OPEN && (
            <FlatButton onClick={onStartGame}>Spiel Starten</FlatButton>
          )
        )}
      </CardActions>
    </Card>
  );
};

export default Game;
