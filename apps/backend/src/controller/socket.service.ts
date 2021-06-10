import { GQLError, WebSocket } from "../deps.ts";
import { Utils } from "../utils/utils.ts";
import { GameEvent, GameEvents } from "../models.ts";
import { GameDatabase } from "../database/index.ts";
import { AuthController } from "../controller/index.ts";

export class SocketService {
  constructor(
    private controller: AuthController,
    private games: GameDatabase,
  ) {}

  async handleGameEvents(socket: WebSocket) {
    for await (const e of socket) {
      if (typeof e === "string") {
        const event = JSON.parse(e) as GameEvent;

        if (event.type === GameEvents.DRAW_FIELD) {
          const user = await this.controller.verifyUser(event.accessToken);
          console.log(user._id);

          this.handleDrawFieldEvent(socket, event);
        }

        console.log(event.type);
        await socket.send("HALLO TEST");
      }
    }
  }

  private async handleDrawFieldEvent(socket: WebSocket, event: GameEvent) {
    const game = await this.games.getGame(event.id);
    if (!game) {
      return;
    }

    const fields = game.fields.filter((field) => !field.checked);
    const random = Utils.getRandomNumber(0, fields.length - 1);
    const drawnField = fields[random];

    fields[random] = {
      ...fields[random],
      checked: true,
    };

    console.log(fields);
    console.log(drawnField);

    await this.games.updateGame({ _id: game._id, changes: { fields } });

    await socket.send(JSON.stringify({
      type: GameEvents.NEW_FIELD_DRAWN,
      data: {
        field: drawnField,
      },
    }));
  }
}
