import { GameService } from "../service/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import { ArgProps, ValidateWin } from "../models.ts";

export const gameQueries = (service: GameService) => {
  const getGames = gqlRequestWrapper(
    requiresAuthentication(({ context }) => service.getGames(context.user)),
  );

  const getGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ args }) => service.getGame(args._id)),
  );

  const getGameInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) =>
      service.getGameInstance(args._id, context.user)
    ),
  );

  const validateWin = gqlRequestWrapper<ArgProps<ValidateWin>>(
    requiresAuthentication(({ context, args }) => service.validateWin(args.props, context.user)),
  );

  return {
    games: getGames,
    game: getGame,
    instance: getGameInstance,
    validateWin: validateWin,
  };
};
