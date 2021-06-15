import { GQLError, v4 } from "../deps.ts";
import {
  BingoField,
  BingoGame,
  BingoInstanceField,
  CreateGame,
  ErrorType,
  FieldMutations,
  GamePhase,
  MutationType,
  UpdateGame,
  User,
  ValidateWin,
} from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { GameSchema } from "../schema/index.ts";
import { Utils } from "../utils/index.ts";

export class GameService {
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

  async getGameInstance(id: string, user: User) {
    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    const instance = game.instances[user._id];
    if (!instance) {
      throw new GQLError(ErrorType.GAME_INSTANCE_NOT_FOUND);
    }

    const instanceFields = instance.fields.reduce<BingoInstanceField[]>(
      (results, id) => {
        const field = game.fields.find((field) => field._id === id);
        if (field) {
          results.push({ ...field, selected: false });
        }

        return results;
      },
      [],
    );

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

  async createGame(props: CreateGame, user: User) {
    if (!props.title || !props.fields) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (props.fields.length < 25) {
      throw new GQLError(ErrorType.GAME_CONTAINS_TOO_FEW_FIELDS);
    }

    const fields = props.fields.map<BingoField>((field) => ({
      text: field,
      _id: v4.generate(),
      checked: false,
    }));

    return await this.games.createGame({
      title: props.title,
      authorId: user._id,
      fields,
      instances: {},
      phase: GamePhase.EDITING,
    });
  }

  async createGameInstance(id: string, user: User) {
    if (!id || !user) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

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

  async updateGame(props: UpdateGame) {
    if (!props._id || !props.changes) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const game = await this.games.getGame(props._id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    return await this.games.updateGame(game._id, props.changes);
  }

  async mutateGameField(id: string, mutation: FieldMutations) {
    if (!id || !mutation) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    if (mutation.type === MutationType.CREATE) {
      await this.games.updateGame(game._id, {
        fields: [...game.fields, {
          _id: mutation._id,
          text: mutation.text,
          checked: false,
        }],
      });
    } else if (mutation.type === MutationType.UPDATE) {
      await this.games.updateGame(game._id, {
        fields: game.fields.map((field) => {
          if (field._id === mutation._id) {
            return { ...field, ...mutation.changes };
          }

          return field;
        }),
      });
    } else {
      await this.games.updateGame(game._id, {
        fields: game.fields.filter((field) => field._id !== mutation._id),
      });
    }

    return true;
  }

  async deleteGame(id: string) {
    if (!id) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    await this.games.deleteGame(game._id);
    return true;
  }

  async validateWin(props: ValidateWin) {
    if (!props._id || !props.fieldIds) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const game = await this.games.getGame(props._id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    for (const id of props.fieldIds) {
      const test = game.fields.find((field) => field._id === id);

      if (test != undefined) {
        if (!test.checked) {
          throw new GQLError(ErrorType.GAME_FIELD_NOT_CHECKED);
        }
      }
    }

    return true;
  }
}
