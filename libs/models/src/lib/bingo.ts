export interface BingoGame {
  _id: string;
  authorId: string;
  title: string;
  phase: Phase;
  fields: BingoField[];
  hasInstance: boolean;
}

export interface BingoField {
  _id: string;
  text: string;
  isSelected?: boolean;
}

export type BingoFields = { [id: string]: BingoField };

export type Phase = "editing" | "open" | "playing" | "finished";

export interface CreateGameProps {
  title: string;
  fields: string[];
}
