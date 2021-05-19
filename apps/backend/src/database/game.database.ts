import { Database } from "../database/database.ts";
import { GameSchema } from '../schema/mongo/game.schema.ts';
import { CreateGameProps } from "../models.ts";


export class GameDatabase {
  private games;

  constructor(database: Database) {
    this.games = database.getDatabase().collection<GameSchema>("games");
  }

  getGames() {
    return this.games.find().toArray();
  }

  getGame(_id: string) {
    return this.games.findOne({ _id });
  }

  async createGame(game: CreateGameProps) {
    const _id = await this.games.insertOne(game);
    return this.games.findOne({ _id });
  }
}