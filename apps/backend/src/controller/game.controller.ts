import { GQLError, v4 } from "../deps.ts";
import { CreateGameProps, ErrorType, User } from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { GameSchema, GameField } from "../schema/index.ts";

export class GameController {
  constructor(private games: GameDatabase) {}

  async getGames(user: User) {
    const games = await this.games.getGames();

    return games.map((game: GameSchema) => {
      const hasInstance = !!game.instances[user._id];
      return { ...game, hasInstance };
    });
  }

  async getGame(id: string) {
    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    return game;
  }

  async createGame(props: CreateGameProps, user: User) {
    if (!props.title || !props.fields) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (props.fields.length < 25) {
      throw new GQLError(ErrorType.GAME_CONTAINS_TOO_FEW_FIELDS);
    }

    const fields = props.fields.map<GameField>((field) => ({
      text: field,
      _id: v4.generate(),
      checked: false,
    }));

    return await this.games.createGame({
      title: props.title,
      authorId: user._id,
      fields,
      instances: {},
      phase: "editing"
    });
  }
}
