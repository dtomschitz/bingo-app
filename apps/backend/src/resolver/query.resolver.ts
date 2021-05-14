import { getGames, getGame } from "../controller/game.controller.ts";
import { getInstance } from "../controller/gameInstance.controller.ts";

export const queries = {
  games: getGames,
  game: getGame,
  instance: getInstance,
};
