import { Bson, GQLError, v4 } from "../deps.ts";
import { ErrorType, GraphQLResolverContext } from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import {
  CreateGame,
  Field,
  GameInstance,
  GameSchema,
} from "../schema/index.ts";

export class GameController {
  constructor(private games: GameDatabase) {}

  async getGames(context: GraphQLResolverContext) {
    const user = context.user;
    if (!user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }

    const games = await this.games.getGames();

    return games.map((game: GameSchema) => {
      const userInstance: GameInstance[] | undefined = game?.gameInstances
        ?.filter((instance) =>
          new Bson.ObjectId(instance.userId).toString() ===
            new Bson.ObjectId(user._id).toString()
        );

      const userResolvedInstance = userInstance
        ? userInstance[0]?.fields.map((fieldId: string) => {
          return game.fields.find((fieldEntry: Field) =>
            fieldEntry._id === fieldId
          );
        })
        : null;

      return { ...game, instance: userResolvedInstance };
    });
  }

  async getGame(context: GraphQLResolverContext, id: string) {
    if (!context.user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }

    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    return game;
  }

  async getInstance(context: GraphQLResolverContext, id: string) {
    const user = context.user;
    if (!user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }

    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    if (!game.gameInstances) {
      throw new GQLError({
        message: "This game doesn't have any instances",
      });
    }

    const gameInstance: GameInstance[] = game.gameInstances.filter((instance) =>
      new Bson.ObjectId(instance.userId).toString() ===
        new Bson.ObjectId(user._id).toString()
    );

    if (!gameInstance[0]) {
      throw new GQLError({
        message: "There is no Instance with the specified id for this user",
      });
    }

    return gameInstance[0].fields.map((fieldId: string) => {
      return game.fields.find((fieldEntry: Field) =>
        fieldEntry._id === fieldId
      );
    });
  }

  async createGame(context: GraphQLResolverContext, props: CreateGame) {      
    if (!context.user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }

    if (!props.title || !props.fields) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (props.fields.length < 25) {
      throw new GQLError(ErrorType.GAME_CONTAINS_TOO_FEW_FIELDS);
    }

    const fields: Field[] = props.fields.map((field) => ({
      text: field,
      _id: v4.generate(),
      checked: false,
    }));

    return await this.games.createGame({
      title: props.title,
      fields,
      author: new Bson.ObjectId(context.user._id),
    });
  }

  async createInstance(context: GraphQLResolverContext, id: string) {
    const user = context.user;
    if (!user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }

    const game = await this.games.getGame(id);
    if (!game) {
      throw new GQLError(ErrorType.GAME_NOT_FOUND);
    }

    const fields = game.fields;
    if (
      game.gameInstances?.some((instance) =>
        new Bson.ObjectId(instance.userId).toString() ===
          new Bson.ObjectId(user._id).toString()
      )
    ) {
      throw new GQLError({
        message: "Only one instance allowed per user",
      });
    }

    const randomNumber = function (min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    
    const randomFields: number[] = [];
    while (randomFields.length < 25) {
      const index = randomNumber(0, (fields.length - 1));

      if (!randomFields.includes(index)) {
        randomFields.push(index);
      }
    }

    const fieldMap = randomFields.map((fieldIndex) => {
      return fields[fieldIndex]._id;
    });

    await this.games.collection.updateOne(
      { _id: new Bson.ObjectId(id) },
      {
        $push: {
          gameInstances: {
            userId: new Bson.ObjectId(user._id),
            fields: fieldMap,
          },
        },
      },
    );

    return randomFields.map((fieldIndex) => {
      return { _id: fields[fieldIndex]._id, text: fields[fieldIndex].text };
    });
  }
}
