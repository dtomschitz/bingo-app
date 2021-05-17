import { UserSchema } from './../schema/mongo/user.schema.ts';
import { database } from "../db/database.ts";
import { CreateUserProps, UpdateUserProps } from "../models.ts";

const users = database.getDatabase().collection<UserSchema>("users");

export const getUserByEmail = async (email: string) => {
  return await users.findOne({ email });
}

export const createUser = async (user: CreateUserProps) => {
  const _id = await users.insertOne(user);
  return await users.findOne({ _id });
}

export const updateUser = (_id: string, update: UpdateUserProps) => {
  return users.updateOne({ _id }, { $set: update }, { upsert: true });
}