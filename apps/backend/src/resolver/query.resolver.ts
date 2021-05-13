import { getGames, getGame } from "../controller/game.controller.ts";

export const queries = {
  games: getGames,
  game: getGame,
};
