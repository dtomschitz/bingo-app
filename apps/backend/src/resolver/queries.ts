import { GameController, GameInstanceController } from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";

export const gameQueries = (controller: GameController) => {
  const getGames = gqlRequestWrapper(
    requiresAuthentication(({ context }) => controller.getGames(context.user)),
  );

  const getGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) =>
      controller.getGame(args._id)
    ),
  );

  return {
    games: getGames,
    game: getGame,
  };
};

export const gameInstanceQueries = (controller: GameInstanceController) => {
  const getGameInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) =>
      controller.getGameInstance(args._id, context.user)
    ),
  );

  return {
    instance: getGameInstance,
  };
};
