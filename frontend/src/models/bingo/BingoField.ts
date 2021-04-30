export interface BingoField {
  id: string;
  text: string;
  isSelected?: boolean;
}

export type BingoFields = { [id: string]: BingoField };
