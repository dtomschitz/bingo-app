import useWebSocket from 'react-use-websocket';
import { GameEventType, GameEvent, ConnectionState } from '@bingo/models';
import { useAuthContext } from './useAuth';

const socketUrl = 'ws://localhost:8000/ws';

interface GameSocketProps {
  id: string;
  onMessage: (event: GameEvent) => void;
}

export const useGameSocket = ({ id, onMessage }: GameSocketProps) => {
  const auth = useAuthContext();

  const { sendJsonMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => sendEvent(GameEventType.JOIN_GAME),
      onMessage: response => {
        if (typeof response.data === 'string') {
          const event = JSON.parse(response.data) as GameEvent;
          onMessage(event);
        }
      },
      onError: console.log,
    },
  );

  const sendEvent = <T = unknown>(type: GameEventType, data?: T) => {
    sendJsonMessage({
      type,
      accessToken: auth.refreshToken,
      id,
      data,
    });
  };

  return {
    sendEvent,
    state: ConnectionState[Object.values(ConnectionState)[readyState]],
    socket: getWebSocket(),
  };
};
