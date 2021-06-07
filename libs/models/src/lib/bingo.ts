export interface BingoGame {
  _id: string;
  authorId: string;
  title: string;
  fields: BingoField[];
  hasInstance: boolean;
}

export interface BingoField {
  _id: string;
  text: string;
  isSelected?: boolean;
  isChecked?: boolean;
}

export type BingoFields = { [id: string]: BingoField };

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
