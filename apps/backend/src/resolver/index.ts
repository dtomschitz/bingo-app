import { AuthService, UserService, GameService } from '../service/index.ts';
import { authMutations, userMutations, gameMutations } from './mutations.ts';
import { gameQueries } from './queries.ts';

/*
Creating all mutations and queries for the services, which were created in the app.ts  
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
