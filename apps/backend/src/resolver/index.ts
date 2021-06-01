import { GameDatabase, UserDatabase } from "../database/index.ts";
import {
  AuthController,
  GameController,
  GameInstanceController,
} from "../controller/index.ts";
import {
  authMutations,
  gameInstanceMutations,
  gameMutations,
} from "./mutations.ts";
import { gameInstanceQueries, gameQueries } from "./queries.ts";

export const resolvers = (
  userDatabase: UserDatabase,
  gameDatabase: GameDatabase,
) => {
  const authController = new AuthController(userDatabase);
  const gameController = new GameController(gameDatabase);
  const gameInstanceController = new GameInstanceController(gameDatabase);

  return {
    Query: {
      ...gameQueries(gameController),
      ...gameInstanceQueries(gameInstanceController),
    },
    Mutation: {
      ...authMutations(authController),
      ...gameMutations(gameController),
      ...gameInstanceMutations(gameInstanceController),
    },
  };
};
