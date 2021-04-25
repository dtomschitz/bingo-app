export interface BingoField {
  id: string;
  index?: number;
  text: string;
  isSelected?: boolean;
}

export type BingoFields = { [id: string]: BingoField };
