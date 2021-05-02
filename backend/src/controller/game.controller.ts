import { GQLError, v4, Bson } from "../deps.ts";
import { database } from "../database.ts";
import { GameSchema } from "../schema/index.ts";

const gameCollection = database.getDatabase().collection<GameSchema>("game");

interface GameCreate {
  title: string;
  fields: BingoField[];
}

interface BingoField {
  _id: string;
  text: string;
  isSelected?: boolean;
}

export const getGame = async (
  parent: any,
  { _id }: { _id: any },
  context: any,
  info: any
) => {
  const game = await gameCollection.findOne({ _id: new Bson.ObjectId(_id) });
  if (!game) {
    throw new GQLError({
      message: "There is no game stored with the specified id",
    });
  }

  return game;
};

export const createGame = async (
  parent: any,
  { gameCreate: { title, fields } }: { gameCreate: GameCreate },
  context: any,
  info: any
) => {
  if (!title || !fields) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  if (fields.length !== 25) {
    throw new GQLError({
      message: "Your request contains either too many or to few bingo fields",
    });
  }

  fields = fields.map((field) => ({
    ...field,
    _id: v4.generate(),
  }));

  const gameId = await gameCollection.insertOne({
    title,
    fields,
  });

  return await gameCollection.findOne({ _id: gameId });
};
