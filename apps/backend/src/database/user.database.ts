import { Database } from '../database/index.ts';
import { UserSchema } from '../schema/index.ts';
import { CreateUserProps } from '../models.ts';
import { Bson, Document } from '../deps.ts';

export class UserDatabase {
  public readonly collection;

  constructor(database: Database) {
    this.collection = database.getDatabase().collection<UserSchema>('users');
  }

  getUser = (id: string | Document) => {
    return this.collection.findOne({ _id: new Bson.ObjectId(id) });
  };

  getUserByEmail = (email: string) => {
    return this.collection.findOne({ email });
  };

  createUser = async (user: CreateUserProps) => {
    const _id = await this.collection.insertOne(user);
    return this.collection.findOne({ _id });
  };

  updateUser = async (_id: Bson.ObjectId, changes: Partial<UserSchema>) => {
    await this.collection.updateOne({ _id }, { $set: changes });
    return this.getUser(_id);
  };

  deleteUser = async (_id: Bson.ObjectId) => {
    await this.collection.deleteOne({ _id });
    return !(await this.getUser(_id));
  };

  clear = () => {
    return this.collection.deleteMany({});
  };

  drop = () => {
    return this.collection.drop();
  };
}
