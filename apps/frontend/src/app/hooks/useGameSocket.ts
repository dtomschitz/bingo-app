import useWebSocket from 'react-use-websocket';
import { GameEvents, GameEvent } from '@bingo/models';
import { useAuthContext } from './useAuth';

const socketUrl = 'ws://localhost:8000/ws';

interface GameSocketProps {
  onMessage: (event: GameEvent) => void;
  id: string;
}

export const useGameSocket = ({ onMessage, id }: GameSocketProps) => {
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
      onOpen: () => {
        sendJsonMessage({
          type: GameEvents.JOIN_GAME,
          accessToken: auth.refreshToken,
          id: id,
          data: {},
        })
      }
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
