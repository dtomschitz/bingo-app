import useWebSocket from 'react-use-websocket';
import { GameEvents, GameEvent } from '@bingo/models';
import { useAuthContext } from './useAuth';

const socketUrl = 'ws://localhost:8000/ws';

interface GameSocketProps {
  onMessage: (event: GameEvent) => void;
}

export const useGameSocket = ({ onMessage }: GameSocketProps) => {
  const auth = useAuthContext();

  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onMessage: response => {
        if (typeof response.data === 'string') {
          const event = JSON.parse(response.data) as GameEvent;
          onMessage(event);
        }
      },
      onError: console.log,
    },
  );

  const sendEvent = (type: GameEvents, id: string, data?: unknown) => {
    sendJsonMessage({
      type,
      accessToken: auth.refreshToken,
      id,
      data,
    });
  };

  return {
    sendEvent,
    state: readyState,
    socket: getWebSocket(),
  };
};
