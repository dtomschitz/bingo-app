import { Database } from "../database/index.ts";
import { GameInstanceSchema, GameSchema } from "../schema/index.ts";
import { Document, Bson } from "../deps.ts";

export class GameDatabase {
  public readonly collection;

  constructor(database: Database) {
    this.collection = database.getDatabase().collection<GameSchema>("games");
  }

  getGames() {
    return this.collection.find().toArray();
  }

  async getGame(_id: string | Document) {
    return await this.collection.findOne({ _id: new Bson.ObjectId(_id) });
  }

  async createGame(game: Omit<GameSchema, "_id">) {
    const _id = await this.collection.insertOne(game);
    return this.getGame(_id);
  }

  createGameInstance(_id: string, instance: GameInstanceSchema) {
    return this.collection.updateOne(
      { _id: new Bson.ObjectId(_id) },
      {
        $set: {
          "instances": {
            [instance.userId]: instance,
          },
        },
      },
    );
  }
}
