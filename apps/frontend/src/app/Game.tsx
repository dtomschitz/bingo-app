import { useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { RouteComponentProps } from 'react-router';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import {
  useAppBar,
  useAuthContext,
  useGameInstanceContext,
  useGameSocket,
} from './hooks';
import { GameEvents } from '@bingo/models';

interface GameProps {
  gameId: string;
}

const Game = (props: RouteComponentProps<GameProps>) => {
  const id = props.match.params.gameId;
  const appBar = useAppBar();
  const auth = useAuthContext();

  const [lastDrawnField, setLastDrawnField] = useState<string>();

  const {
    game,
    error,
    hasGame,
    loading,
    getGameInstance,
  } = useGameInstanceContext();
  const { sendEvent, state, socket } = useGameSocket({
    onMessage: event => {
      if (event.type === GameEvents.NEW_FIELD_DRAWN) {
        setLastDrawnField(event.data.field.text);
      }
      console.log(event);
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[state];

  useEffect(() => {
    getGameInstance(id);
  }, []);

  useEffect(() => appBar.showLoadingBar(loading), [appBar, loading]);

  const onWin = () => {
    console.log('Win');
    //sendJsonMessage();
    //s//endEvent(GameEvents.ON_WIN,);
    //TODO: Win Logic
  };

  const onTest = () => {
    //sendJsonMessage();
    sendEvent(GameEvents.DRAW_FIELD, game._id);
    //TODO: Win Logic
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      <span>The WebSocket is currently {connectionStatus}</span>

      {!loading && (
        <>
          {hasGame && auth.user?._id === game.authorId && (
            <FlatButton className="bingo-button" onClick={onTest}>
              Draw Field
            </FlatButton>
          )}
          <AdminControls />
          {!!lastDrawnField && <div>{lastDrawnField}</div>}
          {hasGame && <BingoCard fields={game.fields} onWin={onWin} />}
          <FlatButton className="bingo-button">BINGO</FlatButton>
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
