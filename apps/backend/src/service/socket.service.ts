import { isWebSocketCloseEvent, WebSocket } from "../deps.ts";
import { GameEvent, GameEventType, Player, User } from "../models.ts";
import { Utils } from "../utils/utils.ts";
import { GameDatabase } from "../database/index.ts";
import { GameSchema } from "../schema/index.ts";

export class SocketService {
  private sessions: Map<string, Set<WebSocket>> = new Map();
  private players: Map<string, Set<Player>> = new Map();

  constructor(private games: GameDatabase) {}

  async handleGameEvents(socket: WebSocket, user: User) {
    for await (const e of socket) {
      if (isWebSocketCloseEvent(e)) {
        this.handleLeftEvent(user);
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
          this.handleJoinEvent(socket, event, user);
        } else if (event.type === GameEventType.DRAW_FIELD) {
          if (user._id.toString() !== game.authorId.toString()) {
            await this.sendEvent(socket, GameEventType.UNAUTHORIZED);
            continue;
          }

          this.handleDrawFieldEvent(socket, event, game);
        } else if (event.type === GameEventType.CLOSE_GAME) {
          if (user._id.toString() !== game.authorId.toString()) {
            await this.sendEvent(socket, GameEventType.UNAUTHORIZED);
            continue;
          }

          this.handleCloseGameEvent(event, game);
        }
      }
    }
  }

  private handleJoinEvent(socket: WebSocket, event: GameEvent, user: User) {
    const gameId = event.id;
    const player: Player = { _id: user._id, name: user.name };

    if (this.sessions.has(gameId)) {
      const sockets = this.sessions.get(gameId);
      if (!sockets) {
        return;
      }

      this.players.get(event.id)?.add(player);

      const players = Array.from(this.players.get(event.id) ?? []);
      this.brodcast(sockets, GameEventType.PLAYER_JOINED, { players });
      this.sendEvent(socket, GameEventType.GAME_JOINED, { players });

      sockets.add(socket);
      console.log(`Added socket to session for game ${event.id}`);
    } else {
      this.sessions.set(event.id, new Set([socket]));
      this.players.set(event.id, new Set([player]));

      const players = Array.from(this.players.get(event.id) ?? []);
      this.sendEvent(socket, GameEventType.GAME_JOINED, { players });

      console.log(`New session created for game ${event.id}`);
    }
  }

  private handleLeftEvent(user: User) {
    this.players.forEach((players, gameId) => {
      for (const player of players) {
        if (player._id === user._id) {
          this.players.get(gameId)?.delete(player);
        }
      }
    });

    this.sessions.forEach((sockets, gameId) => {
      for (const socket of sockets) {
        if (socket.isClosed) {
          const sockets = this.sessions.get(gameId);
          if (!sockets) {
            continue;
          }

          sockets?.delete(socket);

          const players = Array.from(this.players.get(gameId) ?? []);
          this.brodcast(sockets, GameEventType.PLAYER_LEFT, { players });
        }
      }
    });
  }

  private async handleDrawFieldEvent(socket: WebSocket, event: GameEvent, game: GameSchema) {
    const uncheckedFields = game.fields.filter((field) => !field.checked);
    if (uncheckedFields.length === 0) {
      this.sendEvent(socket, GameEventType.NO_MORE_FIELDS);
      return;
    }    

    const random = Utils.getRandomNumber(0, uncheckedFields.length - 1);
    const randomField = uncheckedFields[random];
    
    await this.games.updateGame(game._id, {
      fields: game.fields.map((field) => {
        return field._id === randomField._id
          ? { ...field, checked: true }
          : field;
      }),
    });

    const sockets = this.sessions.get(event.id);
    if (!sockets) {
      return;
    }

    this.brodcast(sockets, GameEventType.NEW_FIELD_DRAWN, {
      field: randomField,
    });
  }

  private async handleCloseGameEvent(event: GameEvent, game: GameSchema) {
    const sockets = this.sessions.get(event.id);
    if (!sockets) {
      return;
    }

    await this.games.deleteGame(game._id);
    this.brodcast(sockets, GameEventType.GAME_CLOSED);
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
