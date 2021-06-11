import { GQLError, v4 } from "../deps.ts";
import {
  CreateGame,
  ErrorType,
  FieldMutations,
  MutationType,
  UpdateGame,
  User,
  BingoField,
  ValidateWin
} from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { GameField, GameSchema } from "../schema/index.ts";

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

  async createGame(props: CreateGame, user: User) {
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

  async updateGame(props: UpdateGame) {
    if (!props._id || !props.changes) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (!await this.games.getGame(props._id)) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    return await this.games.updateGame(props);
  }

  async mutateGameField(_id: string, mutation: FieldMutations) {
    console.log(mutation);

    const game = await this.games.getGame(_id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    if (mutation.type === MutationType.CREATE) {
      await this.games.updateGame({
        _id,
        changes: {
          fields: [...game.fields, {
            _id: mutation._id,
            text: mutation.text,
          }],
        },
      });
    } else if (mutation.type === MutationType.UPDATE) {
      await this.games.updateGame({
        _id,
        changes: {
          fields: game.fields.map((
            field,
          ) => (field._id === mutation._id
            ? { ...field, ...mutation.changes }
            : field)
          ),
        },
      });
    } else {
      await this.games.updateGame({
        _id,
        changes: {
          fields: game.fields.filter((field) => field._id !== mutation._id),
        },
      });
    }

    return true;
  }

  async deleteGame(id: string) {
    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    await this.games.deleteGame(id);    
    return true;
  }

  async validateWin(props: ValidateWin){
    console.log("here");
    
    if (!props._id || !props.fieldIds) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }
    
    const dbGame = await this.games.getGame(props._id);
    if (!dbGame) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }
    
    for(const id in props.fieldIds){
      const test = dbGame.fields.find(field => field._id === id);
      if(test != undefined){
        if(!test.checked){
          console.log("false");
          throw new GQLError(ErrorType.GAME_FIELD_NOT_CHECKED);
        }
      }
    }
    console.log("true");
    return true;
  }

}
