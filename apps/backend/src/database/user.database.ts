import { Database } from "../database/index.ts";
import { UserSchema } from "../schema/mongo/user.schema.ts";
import { CreateUserProps, UpdateUserProps, User  } from "../models.ts";

export class UserDatabase {
  public readonly collection;

  constructor(database: Database) {
    this.collection = database.getDatabase().collection<UserSchema>("users");
  }

  getUserByEmail = (email: string) => {
    return this.collection.findOne({ email });
  };

  createUser = async (user: CreateUserProps) => {
    const _id = await this.collection.insertOne(user);
    return this.collection.findOne({ _id });
  };

  updateUser = (_id: string, update: UpdateUserProps) => {
    return this.collection.updateOne({ _id }, { $set: update }, {
      upsert: true,
    });
  };

  editUser = (_id: string, changes: CreateUserProps) => {
    return this.collection.updateOne({ _id }, { $set: changes }, {
      upsert: true,
    });
  };

  deleteUser = (_id: string) => {
    return this.collection.deleteOne({ _id });
  };

  clear = () => {
    return this.collection.deleteMany({});
  };

  drop = () => {
    return this.collection.drop();
  };
}
