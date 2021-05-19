import { GameDatabase } from "../database/index.ts";
import { GQLError } from "../deps.ts";
import { CreateGameProps } from "../models.ts";

export class GameController {
  constructor(private games: GameDatabase) {}

  async getGames() {
    return await this.games.getGames();
  }

  async getGame(_id: string) {
    const game = await this.games.getGame(_id);
    if (!game) {
      throw new GQLError({
        message: "There is no game stored with the specified id",
      });
    }

    return game;
  }

  async createGame(props: CreateGameProps) {
    //await validateAuthentication(context);
  
    if (!props.title || !props.fields) {
      throw new GQLError({ message: "Your request has the wrong format" });
    }
  
    if (props.fields.length < 25) {
      throw new GQLError({
        message: "Your request contains either too many or to few bingo fields",
      });
    }

    return await this.games.createGame(props)
  }
}