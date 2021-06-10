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
import { gameSubscriptions } from "./subscriptions.ts";

export const resolvers = (
  authController: AuthController,
  gameController: GameController,
  gameInstanceController : GameInstanceController
) => {
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
    Subscription: {
      ...gameSubscriptions()
    }
  };
};
