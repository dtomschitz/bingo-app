import {
  AuthService,
  GameInstanceService,
  GameService,
} from "../service/index.ts";
import {
  authMutations,
  gameInstanceMutations,
  gameMutations,
} from "./mutations.ts";
import { gameInstanceQueries, gameQueries } from "./queries.ts";

export const resolvers = (
  authService: AuthService,
  gameService: GameService,
  gameInstanceService: GameInstanceService,
) => {
  return {
    Query: {
      ...gameQueries(gameService),
      ...gameInstanceQueries(gameInstanceService),
    },
    Mutation: {
      ...authMutations(authService),
      ...gameMutations(gameService),
      ...gameInstanceMutations(gameInstanceService),
    },
  };
};
