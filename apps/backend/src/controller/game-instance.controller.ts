import { GQLError, WebSocket } from "../deps.ts";
import { BingoField, BingoGame, ErrorType, User, BaseContext } from "../models.ts";
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

    const fields = instance.fields.reduce<BingoField[]>((results, id) => {
      const field = game.fields.find((field) => field._id === id);
      if (field) {
        results.push(field);
      }

      return results;
    }, []);

    const gameInstance: BingoGame = {
      _id: game._id,
      authorId: game.authorId,
      title: game.title,
      phase: game.phase,
      fields,
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
    const randomFields: BingoField[] = [];

    while (randomFields.length < 25) {
      const index = this.getRandomNumber(0, (game.fields.length - 1));
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
      _id: game._id,
      authorId: game.authorId,
      title: game.title,
      phase: game.phase,
      fields: randomFields.map(({ _id, text }) => ({ _id, text })),
      hasInstance: true,
    };

    return gameInstance;
  }

  async handleGameEvents(socket: WebSocket) {
    for await (const e of socket) {
      if (typeof e === 'string') {
        const event = JSON.parse(e);
        console.log(event.type);
        await socket.send('HALLO TEST');
      }
    }
  }

  private getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
