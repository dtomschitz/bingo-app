import { GameDatabase, UserDatabase } from "../database/index.ts";
import { AuthController, GameController } from "../controller/index.ts";
import { authMutations, gameMutations } from "./mutations.ts";
import { gameQueries } from "./queries.ts";

export const resolvers = (
  userDatabase: UserDatabase,
  gameDatabase: GameDatabase,
) => {
  const authController = new AuthController(userDatabase); 
  const gameController = new GameController(gameDatabase); 

  return {
    Query: {
      ...gameQueries(gameController)
    },
    Mutation: {
      ...authMutations(authController),
      ...gameMutations(gameController)
    },
  };
};
