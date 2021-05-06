import { BingoField } from "./BingoField";

export interface BingoGame {
  _id: string;
  title: string;
  fields: BingoField[];
}
