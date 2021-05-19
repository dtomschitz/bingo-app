import { GameController } from "../controller/index.ts";
import { Context } from "../deps.ts";
import { GraphQLProps } from "../models.ts";

export const gameQueries = (controller: GameController) => {
  const getGames = (
    parent: any,
    {}: any,
    context: Context,
    info: any,
  ) => controller.getGames();

  const getGame = (
    parent: any,
    { props }: GraphQLProps<{ _id: string }>,
    context: Context,
    info: any,
  ) => controller.getGame(props._id);

  return {
    games: getGames,
    game: getGame,
  };
};
