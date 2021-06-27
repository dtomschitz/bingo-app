import { AuthService, UserService, GameService } from '../service/index.ts';
import { authMutations, userMutations, gameMutations } from './mutations.ts';
import { gameQueries } from './queries.ts';

/**
 * Creates all mutations and queries, which are used in the app.ts 
 * 
 * @param authService The current instance of the auth service.
 * @param userService The current instance of the user service.
 * @param gameService The current instance of the game service.
 * 
 * @returns All mutations and queries
 */
export const resolvers = (
  authService: AuthService,
  userService: UserService,
  gameService: GameService,
) => {
  return {
    Query: {
      ...gameQueries(gameService),
    },
    Mutation: {
      ...authMutations(authService),
      ...userMutations(userService),
      ...gameMutations(gameService),
    },
  };
};
