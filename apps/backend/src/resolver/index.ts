import { AuthService, GameService } from "../service/index.ts";
import { authMutations, gameMutations } from "./mutations.ts";
import { gameQueries } from "./queries.ts";

export const resolvers = (
  authService: AuthService,
  gameService: GameService,
) => {
  return {
    Query: {
      ...gameQueries(gameService),
    },
    Mutation: {
      ...authMutations(authService),
      ...gameMutations(gameService),
    },
  };
};
