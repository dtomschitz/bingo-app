export enum ConnectionState {
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  UNINSTANTIATED = 'UNINSTANTIATED',
}

const messages: { [key in ConnectionState]: string } = {
  CONNECTING: 'Verbinden...',
  OPEN: 'Verbunden',
  CLOSING: 'Schließen',
  CLOSED: 'Geschlossen',
  UNINSTANTIATED: 'Uninstantiert',
};

export const getConnectionStateMessage = (
  type: ConnectionState | keyof typeof ConnectionState,
) => {
  return messages[typeof type === 'string' ? ConnectionState[type] : type];
};
