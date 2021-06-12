import { isWebSocketCloseEvent, WebSocket } from "../deps.ts";
import { Utils } from "../utils/utils.ts";
import { GameEvent, GameEventType } from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { GameSchema } from "../schema/index.ts";
import { AuthController } from "../controller/index.ts";

export class SocketService {
  private gameSessions: Map<string, Set<WebSocket>> = new Map();

  constructor(
    private controller: AuthController,
    private games: GameDatabase,
  ) {}

  async handleGameEvents(socket: WebSocket) {
    for await (const e of socket) {
      if (isWebSocketCloseEvent(e)) {
        this.gameSessions.forEach((sockets, key) => {
          for (const socket of sockets) {
            if (socket.isClosed) {
              this.gameSessions.get(key)?.delete(socket);
            }
          }
        });

        console.log(this.gameSessions);
        

        continue;
      }

      if (typeof e === "string") {
        const event = JSON.parse(e) as GameEvent;
        const game = await this.games.getGame(event.id);

        if (!game) {
          await this.sendEvent(socket, GameEventType.GAME_NOT_FOUND);
          continue;
        }

        if (event.type === GameEventType.JOIN_GAME) {
          this.handleJoinEvent(socket, event);
        } else if (event.type === GameEventType.DRAW_FIELD) {
          const user = await this.controller.verifyUser(event.accessToken);

          if (user._id.toString() !== game.authorId.toString()) {
            await this.sendEvent(socket, GameEventType.UNAUTHORIZED);
            continue;
          }

          this.handleDrawFieldEvent(event, game);
        }
      }
    }
  }

  private handleJoinEvent(socket: WebSocket, event: GameEvent) {
    if (this.gameSessions.has(event.id)) {
      const connectionsOfGame = this.gameSessions.get(event.id);
      connectionsOfGame?.add(socket);
      console.log(`Added socket to session for game ${event.id}`);
    } else {
      this.gameSessions.set(event.id, new Set([socket]));
      console.log(`New session created for game ${event.id}`);
    }
  }

  private async handleDrawFieldEvent(event: GameEvent, game: GameSchema) {
    const fields = game.fields;
    const uncheckedFields = game.fields.filter((field) => !field.checked);
    const random = Utils.getRandomNumber(0, uncheckedFields.length - 1);

    fields[random] = {
      ...fields[random],
      checked: true,
    };

    await this.games.updateGame(game._id, { fields });

    const sessionsOfgame = this.gameSessions.get(event.id);
    if (!sessionsOfgame) {
      return;
    }

    sessionsOfgame.forEach(async (sessionSocket: WebSocket) => {
      if (!sessionSocket.isClosed) {
        console.log("send field drawn to socket");
        await this.sendEvent(sessionSocket, GameEventType.NEW_FIELD_DRAWN, {
          field: fields[random],
        });
      } else {
        sessionsOfgame.delete(sessionSocket);
        console.log("closed socket");
      }
    });
  }

  private async sendEvent<T>(socket: WebSocket, type: GameEventType, data?: T) {
    await socket.send(JSON.stringify({
      type,
      data,
    }));
  }
}
