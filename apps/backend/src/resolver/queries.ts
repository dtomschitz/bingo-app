import { GameController } from "../controller/index.ts";
import { gqlRequestWrapper } from "../utils/index.ts";

export const gameQueries = (controller: GameController) => {
  const getGames = gqlRequestWrapper(() => controller.getGames());

  const getGame = gqlRequestWrapper<{ _id: string }>((
    { args: { props } },
  ) => controller.getGame(props._id));

  return {
    games: getGames,
    game: getGame,
  };
};
