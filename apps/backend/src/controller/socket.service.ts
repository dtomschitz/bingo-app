import { WebSocket } from "../deps.ts";
import { Utils } from "../utils/utils.ts";
import { GameEvent, GameEvents, User, BingoField } from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { AuthController } from "../controller/index.ts";
import { GameField, GameSchema } from "../schema/mongo/index.ts";

export class SocketService {
  constructor(
    private controller: AuthController,
    private games: GameDatabase,
  ) {}

  private gameSessions: Map<string, Set<WebSocket>> = new Map();

  async handleGameEvents(socket: WebSocket) {

    for await (const e of socket) {

      if (typeof e === "string") {
        const event = JSON.parse(e) as GameEvent;

        if(event.type === GameEvents.JOIN_GAME){
          const user = await this.controller.verifyUser(event.accessToken);
          this.handleJoin(socket, event, user);
        }

        if (event.type === GameEvents.DRAW_FIELD) {
          const user = await this.controller.verifyUser(event.accessToken);

          this.handleDrawFieldEvent(socket, event);
        }
      }
    }
  }

  private async handleJoin(socket: WebSocket, event: GameEvent, user: User){

    const game = await this.games.getGame(event.id);
    if (!game) {
      return;
    }

    if(this.gameSessions.has(event.id)){
      const connectionsOfGame = this.gameSessions.get(event.id);
      connectionsOfGame?.add(socket);
      console.log(`Added socket to session for game ${event.id}`);
      return;
    }
    else{
      this.gameSessions.set(event.id, new Set([socket]))
      console.log(`New session created for game ${event.id}`);
      return;
    }

  }

  private async handleDrawFieldEvent(socket: WebSocket, event: GameEvent) {
    const game: GameSchema | undefined = await this.games.getGame(event.id);
    if (!game) {
      return;
    }

    const fields: GameField[] = game.fields.filter((field: GameField) => !field.checked);

    if(fields.length <= 0){
      return
    }

    const checkedFields = game.fields.filter((field: GameField) => field.checked);
    const random = Utils.getRandomNumber(0, fields.length - 1);
    const drawnField = fields[random];

    fields[random] = {
      ...fields[random],
      checked: true,
    };

    await this.games.updateGame({ _id: game._id, changes: { fields: [...fields, ...checkedFields] as BingoField[] } });

    const sessionsOfgame = this.gameSessions.get(event.id);

    if(!sessionsOfgame){
      return;
    }

    await sessionsOfgame.forEach(async function(sessionSocket:WebSocket) {
      if(!sessionSocket.isClosed){
        console.log("send field drawn to socket");
        await sessionSocket.send(JSON.stringify({
          type: GameEvents.NEW_FIELD_DRAWN,
          data: {
            field: drawnField,
          },
        }));
      }
      else{
        sessionsOfgame.delete(sessionSocket);
        console.log("closed socket");
      }
    });

  }
}
