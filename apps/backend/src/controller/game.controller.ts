import { GQLError, v4, Bson, Context } from "../deps.ts";
import { database } from "../db/database.ts";
import { GameSchema, CreateGame, Field } from "../schema/index.ts";
import { validateAuthentication } from "./auth.controller.ts";
import { UserSchema } from './../schema/mongo/user.schema.ts';

const gameCollection = database.getDatabase().collection<GameSchema>("game");

export const getGames = async (
  parent: any,
  { }: any,
  context: Context,
  info: any
) => {
  const user: UserSchema | undefined = await validateAuthentication(context);
  
  if (!user){
    throw new GQLError({
      message: "User not found"
    })
  }
  
  return await gameCollection.find({ author: new Bson.ObjectId(user._id) }).toArray();
};

export const getGame = async (
  parent: any,
  { _id }: { _id: any },
  context: Context,
  info: any
) => {
  const user: UserSchema | undefined = await validateAuthentication(context);
  
  if (!user){
    throw new GQLError({
      message: "User not found"
    })
  }

  const game = await gameCollection.findOne({ _id: new Bson.ObjectId(_id), author: new Bson.ObjectId(user._id) });
  if (!game) {
    throw new GQLError({
      message: "There is no game stored for this user with the specified id",
    });
  }

  return game;
};

export const createGame = async (
  parent: any,
  { input }: { input: CreateGame },
  context: Context,
  info: any
) => {
  const user: UserSchema | undefined = await validateAuthentication(context);
  
  if (!user){
    throw new GQLError({
      message: "User not found"
    })
  }

  if (!input.title || !input.fields) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  if (input.fields.length < 25) {
    throw new GQLError({
      message: "Your request contains either too many or to few bingo fields",
    });
  }

  const gameFields: Field[] = input.fields.map((field) => ({
    name: field,
    _id: v4.generate(),
    checked: false,
  }));

  const { title, fields } = input;
  const gameId = await gameCollection.insertOne({
    title: input.title,
    fields: gameFields,
    author: new Bson.ObjectId(user._id),
  });

  return await gameCollection.findOne({ _id: gameId });
};
