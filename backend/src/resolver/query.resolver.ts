import { getUser } from "../controller/auth.controller.ts";
import { getGame } from "../controller/game.controller.ts";

export const queries = {
  getUser: getUser,
  getGame: getGame,
};
