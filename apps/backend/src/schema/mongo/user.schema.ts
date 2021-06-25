import { Bson } from "../../deps.ts";
import { User } from "../../models.ts";

export interface UserSchema extends Omit<User, '_id'> {
  _id: Bson.ObjectId;
  accessToken: string;
  refreshToken: string
}