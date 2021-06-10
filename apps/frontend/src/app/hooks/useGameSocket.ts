import useWebSocket from 'react-use-websocket';
import { GameEvents, GameEvent } from '@bingo/models';

const socketUrl = 'ws://localhost:8000/ws';

interface GameSocketProps {
  onMessage: (event: GameEvent) => void;
}

export const useGameSocket = ({ onMessage }: GameSocketProps) => {
  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onMessage: response => {
        const event = response.data as GameEvent;
        console.log(event);
        onMessage(event);
      },
      onError: console.log,
    },
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
