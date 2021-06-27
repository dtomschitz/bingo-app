export interface BingoGame {
  _id: string;
  authorId: string;
  title: string;
  phase: GamePhase;
  podium?: Podium[];
  fields: BingoField[];
  instanceFields?: BingoInstanceField[];
  hasInstance: boolean;
}

export interface BingoField {
  _id: string;
  text: string;
  checked: boolean;
}

export interface BingoInstanceField {
  _id: string;
  text: string;
  selected?: boolean;
}

export interface Podium {
  userId: string;
  name: string;
  placement: number;
}

export interface BingoCardState {
  fields: BingoInstanceField[];
  score: number;
  hasWon: boolean;
}

export enum GamePhase {
  EDITING = 'EDITING',
  OPEN = 'OPEN',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export interface ValidateWin {
  _id: string;
  fieldIds: string[];
}

export interface CreateGame {
  title: string;
  fields: string[];
}

export interface UpdateGame {
  _id: string;
  changes: Partial<Omit<BingoGame, '_id' | 'authorId' | 'hasInstance'>>;
}

export interface CreateField {
  type: MutationType.CREATE;
  _id: string;
  text: string;
}

export interface UpdateField {
  type: MutationType.UPDATE;
  _id: string;
  changes: Partial<Omit<BingoField, '_id'>>;
}

export interface DeleteField {
  type: MutationType.DELETE;
  _id: string;
}

export interface MutateGameField {
  _id: string;
  mutation: FieldMutations;
}

export type FieldMutations = CreateField | UpdateField | DeleteField;

export enum MutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum GameEventType {
  JOIN_GAME = 'JOIN_GAME',
  GAME_JOINED = 'GAME_JOINED',
  PLAYER_JOINED = 'PLAYER_JOINED',
  LEAVE_GAME = 'LEAVE_GAME',
  PLAYER_LEFT = 'PLAYER_LEFT',
  NO_MORE_FIELDS = 'NO_MORE_FIELDS',
  DRAW_FIELD = 'DRAW_FIELD',
  NEW_FIELD_DRAWN = 'NEW_FIELD_DRAWN',
  ON_WIN = 'ON_WIN',
  NEW_WINNER = 'NEW_WINNER',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  CLOSE_GAME = 'CLOSE_GAME',
  START_GAME = 'START_GAME',
  GAME_CLOSED = 'GAME_CLOSED',
  GAME_STARTED = 'GAME_STARTED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface GameEvent<T = any> {
  type: GameEventType;
  accessToken: string;
  id: string;
  data?: T;
}
