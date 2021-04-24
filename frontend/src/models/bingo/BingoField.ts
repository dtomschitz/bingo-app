export interface BingoField {
  id: string;
  text: string;
  isSelected?: boolean;
  row?: number;
  column?: number;
}

export type BingoFields = { [id: string]: BingoField };
