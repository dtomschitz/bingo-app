import { UserSchema } from './../schema/mongo/user.schema.ts';
import { database } from "../db/database.ts";

const users = database.getDatabase().collection<UserSchema>("users");

export const getUserFromDb = async (email: string) => {
  const user = await users.findOne({ email: email });
  return user ?? null;
}

export const addUserToDb = () => {
  return "test";
}