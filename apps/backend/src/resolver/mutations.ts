import { AuthService, UserService, GameService } from '../service/index.ts';
import { gqlRequestWrapper, requiresAuthentication } from '../utils/index.ts';
import {
  ArgProps,
  CreateGame,
  CreateUserProps,
  LoginProps,
  LogoutProps,
  MutateGameField,
  RefreshAccessTokenProps,
  UpdateGame,
  UpdateUser,
} from '../models.ts';

/**
 * Creates all auth specific mutations.
 * The gqlRequestWrapper syntactically wraps the individual sercive method for 
 * each respective resolver.
 * 
 * @param service The instance of a the current auth service.
 * @returns All auth specific mutations.
 */
export const authMutations = (service: AuthService) => {
  const registerUser = gqlRequestWrapper<ArgProps<CreateUserProps>>(
    ({ args }) => service.registerUser(args.props),
  );

  const loginUser = gqlRequestWrapper<LoginProps>(({ args }) =>
    service.loginUser(args.email, args.password),
  );

  const logoutUser = gqlRequestWrapper<LogoutProps>(({ args }) =>
    service.logoutUser(args.email),
  );

  const verifyUser = gqlRequestWrapper<RefreshAccessTokenProps>(({ args }) =>
    service.verifyUser(args.refreshToken),
  );

  const refreshAccessToken = gqlRequestWrapper<RefreshAccessTokenProps>(
    ({ args }) => service.refreshAccessToken(args.refreshToken),
  );

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    refreshAccessToken,
  };
};

/**
 * Creates all user specific mutations.
 * The gqlRequestWrapper syntactically wraps the individual sercive method for 
 * each respective resolver.
 * 
 * @param service The instance of a the current user service.
 * @returns All user specific mutations.
 */
export const userMutations = (service: UserService) => {
  const updateUser = gqlRequestWrapper<ArgProps<UpdateUser>>(({ args }) =>
    service.updateUser(args.props),
  );

  const deleteUser = gqlRequestWrapper<{ _id: string }>(({ args }) =>
    service.deleteUser(args._id),
  );

  return {
    updateUser,
    deleteUser,
  };
};

/**
 * Creates all game specific mutations.
 * The gqlRequestWrapper syntactically wraps the individual sercive method for 
 * each respective resolver.
 * 
 * @param service The instance of a the current game service.
 * @returns All game specific mutations.
 */
export const gameMutations = (service: GameService) => {
  const createGame = gqlRequestWrapper<ArgProps<CreateGame>>(
    requiresAuthentication(({ context, args }) =>
      service.createGame(args.props, context.user),
    ),
  );

  const createGameInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) => {
      return service.createGameInstance(args._id, context.user);
    }),
  );

  const updateGame = gqlRequestWrapper<ArgProps<UpdateGame>>(
    requiresAuthentication(({ args }) => service.updateGame(args.props)),
  );

  const mutateField = gqlRequestWrapper<ArgProps<MutateGameField>>(
    requiresAuthentication(({ args }) =>
      service.mutateGameField(args.props._id, args.props.mutation),
    ),
  );

  const deleteGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ args }) => service.deleteGame(args._id)),
  );

  return {
    createGame,
    createGameInstance,
    updateGame,
    mutateField,
    deleteGame,
  };
};
