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
}

export type BingoFields = { [id: string]: BingoField };

export interface CreateGameProps {
  title: string;
  fields: string[];
}
