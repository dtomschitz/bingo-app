import { GQLError } from "../deps.ts";
import { BingoField, BingoInstanceField, BingoGame, ErrorType, User } from "../models.ts";
import { Utils } from "../utils/utils.ts";
import { GameDatabase } from "../database/index.ts";

export class GameInstanceController {
  constructor(private games: GameDatabase) {}

  async getGameInstance(id: string, user: User) {
    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    const instance = game.instances[user._id];
    if (!instance) {
      throw new GQLError(ErrorType.GAME_INSTANCE_NOT_FOUND);
    }

    const instanceFields = instance.fields.reduce<BingoInstanceField[]>((results, id) => {
      const field = game.fields.find((field) => field._id === id);
      if (field) {
        results.push({...field, selected: false });
      }

      return results;
    }, []);

    const gameInstance: BingoGame = {
      _id: game._id.toHexString(),
      authorId: game.authorId,
      title: game.title,
      phase: game.phase,
      fields: game.fields,
      instanceFields,
      hasInstance: true,
    };

    return gameInstance;
  }

  async createGameInstance(id: string, user: User) {
    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    const isAlreadyCreated = !!game.instances[user._id];
    if (isAlreadyCreated) {
      throw new GQLError(ErrorType.GAME_INSTANCE_ALREADY_CREATED);
    }

    const fields = game.fields;
    if (fields.length < 25) {
      throw new GQLError(ErrorType.INVALID_GAME);
    }

    const randomFields: BingoField[] = [];
    while (randomFields.length < 25) {
      const index = Utils.getRandomNumber(0, (game.fields.length - 1));
      const field = fields[index];

      if (!randomFields.includes(field)) {
        randomFields.push(field);
      }
    }

    await this.games.createGameInstance(id, {
      userId: user._id,
      fields: randomFields.map((field) => field._id),
    });

    const gameInstance: BingoGame = {
      _id: id,
      authorId: game.authorId,
      title: game.title,
      phase: game.phase,
      fields,
      instanceFields: randomFields.map(({ _id, text }) => ({
        _id,
        text,
        selected: true,
      })),
      hasInstance: true,
    };

    return gameInstance;
  }
}
