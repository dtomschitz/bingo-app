import { getUser } from "../controller/auth.controller.ts";
import { getGames, getGame } from "../controller/game.controller.ts";

export const queries = {
  getUser: getUser,
  games: getGames,
  game: getGame,
};
