import { useEffect, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { RouteComponentProps } from 'react-router';
import { BingoCard } from './components/bingo';
import { FlatButton } from './components/common';
import { useAppBar, useGameInstanceContext, useGameSocket } from './hooks';
import { GameEvents } from '@bingo/models';

interface GameProps {
  gameId: string;
}

const socketUrl = 'ws://localhost:8000/ws';

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
  const { sendEvent, state, socket } = useGameSocket();

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
    sendEvent(GameEvents.ON_WIN, {});
    //TODO: Win Logic
  };

  const onTest = () => {
    //sendJsonMessage();
    sendEvent(GameEvents.ON_WIN, {});
    //TODO: Win Logic
  };

  if (error) {
    return <div className="game"></div>;
  }

  return (
    <div className="game">
      <span>The WebSocket is currently {connectionStatus}</span>
      <FlatButton className="bingo-button" onClick={onTest}>
        Socket Test
      </FlatButton>
      {!loading && (
        <>
          <AdminControls />
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
