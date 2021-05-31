import { GameController } from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";

export const gameQueries = (controller: GameController) => {
  const getGames = gqlRequestWrapper(
    requiresAuthentication(({ context }) =>
      controller.getGames(context)
    ),
  );

  const getGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, props }) =>
      controller.getGame(context,  props._id)
    ),
  );

  const getInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, props }) =>
      controller.getInstance(context,  props._id)
    ),
  );

  return {
    games: getGames,
    game: getGame,
    instance: getInstance,
  };
};
