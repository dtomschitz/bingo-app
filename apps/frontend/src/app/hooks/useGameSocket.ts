import useWebSocket from 'react-use-websocket';
import { GameEvents } from '@bingo/models';

const socketUrl = 'ws://localhost:8000/ws';

export const useGameSocket = () => {
  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    { onMessage: console.log },
  );

  const sendEvent = (type: GameEvents, data: unknown) => {
    sendJsonMessage({
      type,
      data,
    });
  };

  return {
    sendEvent,
    state: readyState,
    socket: getWebSocket(),
  };
};
