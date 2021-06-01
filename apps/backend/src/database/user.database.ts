import { Database } from "../database/index.ts";
import { UserSchema } from '../schema/mongo/user.schema.ts';
import { CreateUserProps, UpdateUserProps } from "../models.ts";

export class UserDatabase {
  private users;

  constructor(database: Database) {
    this.users = database.getDatabase().collection<UserSchema>("users");
  }

  getUserByEmail = (email: string) => {
    return this.users.findOne({ email });
  }

  createUser = async (user: CreateUserProps) => {
    const _id = await this.users.insertOne(user);
    return this.users.findOne({ _id });
  }

  updateUser = (_id: string, update: UpdateUserProps) => {
    return this.users.updateOne({ _id }, { $set: update }, { upsert: true });
  }

  clear = () => {
    return this.users.deleteMany({});
  }

  drop = () => {
    return this.users.drop();
  }
}