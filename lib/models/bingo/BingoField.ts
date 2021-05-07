export interface BingoField {
  _id: string;
  text: string;
  isSelected?: boolean;
}

export type BingoFields = { [id: string]: BingoField };
