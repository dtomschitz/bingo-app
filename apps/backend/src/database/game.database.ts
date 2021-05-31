import { Database } from "../database/database.ts";
import { GameSchema } from '../schema/mongo/game.schema.ts';

export class GameDatabase {
  public readonly collection;

  constructor(database: Database) {
    this.collection = database.getDatabase().collection<GameSchema>("games");
  }

  getGames() {
    return this.collection.find().toArray();
  }

  getGame(_id: string) {
    return this.collection.findOne({ _id });
  }

  async createGame(game: GameSchema) {
    const _id = await this.collection.insertOne(game);
    return this.collection.findOne({ _id });
  }
}