import { Bson } from "../../deps.ts";
import { BingoGame } from "../../models.ts";

export interface GameSchema
  extends Omit<BingoGame, "_id" | "hasInstance" | "instanceFields"> {
  _id: Bson.ObjectId;
  instances: { [key: string]: GameInstanceSchema };
  winners?: string[];
}

export interface GameInstanceSchema {
  userId: string;
  fields: string[];
}
