import { Database } from "../database/index.ts";
import { GameInstanceSchema, GameSchema } from "../schema/index.ts";
import { Bson, Document } from "../deps.ts";

/*
Get game specific data from the database for the services
*/

export class GameDatabase {
  public readonly collection;

  constructor(database: Database) {
    this.collection = database.getDatabase().collection<GameSchema>("games");
  }

  getGames() {
    return this.collection.find().toArray();
  }

  getGame(id: string | Document) {
    return this.collection.findOne({ _id: new Bson.ObjectId(id) });
  }

  async createGame(game: Omit<GameSchema, "_id">) {
    const _id = await this.collection.insertOne(game);
    return this.getGame(_id);
  }

  async updateGame(_id: Bson.ObjectId, changes: Partial<GameSchema>) {    
    await this.collection.updateOne({ _id }, {
      $set: changes,
    });    

    return this.getGame(_id);
  }

  async deleteGame(_id: Bson.ObjectId) {
    return await this.collection.deleteOne({ _id });
  }

  createGameInstance(_id: string, instance: GameInstanceSchema) {
    return this.collection.updateOne(
      { _id: new Bson.ObjectId(_id) },
      {
        $set: {
          [`instances.${instance.userId}`]: instance,
        },
      },
    );
  }

  clear = () => {
    return this.collection.deleteMany({});
  };

  drop = () => {
    return this.collection.drop();
  };
}
