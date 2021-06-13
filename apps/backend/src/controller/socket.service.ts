import { isWebSocketCloseEvent, WebSocket } from '../deps.ts';
import { Utils } from '../utils/utils.ts';
import { GameEvent, GameEventType } from '../models.ts';
import { GameDatabase } from '../database/index.ts';
import { GameSchema } from '../schema/index.ts';
import { AuthController } from '../controller/index.ts';

export class SocketService {
  private sessions: Map<string, Set<WebSocket>> = new Map();

  constructor(
    private controller: AuthController,
    private games: GameDatabase,
  ) {}

  async handleGameEvents(socket: WebSocket) {
    for await (const e of socket) {
      if (isWebSocketCloseEvent(e)) {
        this.sessions.forEach((sockets, key) => {
          for (const socket of sockets) {
            if (socket.isClosed) {
              const sockets = this.sessions.get(key);
              
              if (!sockets) {
                continue;
              }

              sockets.delete(socket);
              this.brodcast(sockets, GameEventType.PLAYER_LEFT);
            }
          }
        });

        continue;
      }

      if (typeof e === 'string') {
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
    if (this.sessions.has(event.id)) {
      const sockets = this.sessions.get(event.id);
      if (!sockets) {
        return;
      }

      this.brodcast(sockets, GameEventType.PLAYER_JOINED);

      sockets.add(socket);
      console.log(`Added socket to session for game ${event.id}`);

      return;
    } 

    this.sessions.set(event.id, new Set([socket]));
    console.log(`New session created for game ${event.id}`);
  }

  private async handleDrawFieldEvent(event: GameEvent, game: GameSchema) {
    const fields = game.fields;
    const uncheckedFields = game.fields.filter(field => !field.checked);
    const random = Utils.getRandomNumber(0, uncheckedFields.length - 1);

    fields[random] = {
      ...fields[random],
      checked: true,
    };

    await this.games.updateGame(game._id, { fields });

    const sockets = this.sessions.get(event.id);
    if (!sockets) {
      return;
    }

    this.brodcast(sockets, GameEventType.NEW_FIELD_DRAWN, {
      field: fields[random],
    });
  }

  private sendEvent<T>(socket: WebSocket, type: GameEventType, data?: T) {
    return socket.send(
      JSON.stringify({
        type,
        data,
      }),
    );
  }

  private brodcast<T>(sockets: Set<WebSocket>, type: GameEventType, data?: T) {
    for (const socket of sockets.values()) {
      if (socket.isClosed) {
        continue;
      }

      this.sendEvent(socket, type, data);
    }
  }
}
