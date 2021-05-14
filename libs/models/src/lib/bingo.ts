export interface BingoGame {
  _id: string;
  title: string;
  fields: BingoField[];
}

export interface BingoField {
  _id?: string;
  text: string;
  isSelected?: boolean;
}

export type BingoFields = { [id: string]: BingoField };
