import { GQLError, v4, Bson } from "../deps.ts";
import { database } from "../db/database.ts";
import { GameSchema } from "../schema/index.ts";

const gameCollection = database.getDatabase().collection<GameSchema>("game");

interface CreateGame {
  title: string;
  fields: BingoField[];
}

interface BingoField {
  _id: string;
  text: string;
  isSelected?: boolean;
}

export const getGames = async (
  parent: any,
  {}: any,
  context: any,
  info: any
) => {
  return await gameCollection.find().toArray();
};

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
  { input }: { input: CreateGame },
  context: any,
  info: any
) => {
  if (!input.title || !input.fields) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  if (input.fields.length !== 25) {
    throw new GQLError({
      message: "Your request contains either too many or to few bingo fields",
    });
  }

  input.fields = input.fields.map((field) => ({
    ...field,
    _id: v4.generate(),
  }));

  const { title, fields } = input;
  const gameId = await gameCollection.insertOne({
    title,
    fields,
  });

  return await gameCollection.findOne({ _id: gameId });
};
