import {
  AuthController,
  GameController,
  GameInstanceController,
} from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import {
  ArgProps,
  CreateGameProps,
  CreateUserProps,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
} from "../models.ts";

export const authMutations = (controller: AuthController) => {
  const registerUser = gqlRequestWrapper<ArgProps<CreateUserProps>>((
    { args },
  ) => controller.registerUser(args.props));

  const loginUser = gqlRequestWrapper<LoginProps>((
    { args },
  ) => controller.loginUser(args.email, args.password));

  const logoutUser = gqlRequestWrapper<LogoutProps>((
    { args },
  ) => controller.logoutUser(args.email));

  const verifyUser = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args },
  ) => controller.verifyUser(args.refreshToken));

  const refreshAccessToken = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args },
  ) => controller.refreshAccessToken(args.refreshToken));

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    refreshAccessToken,
  };
};

export const gameMutations = (controller: GameController) => {
  const createGame = gqlRequestWrapper<ArgProps<CreateGameProps>>(
    requiresAuthentication(({ context, args }) =>
      controller.createGame(args.props, context.user)
    ),
  );

  return { createGame };
};

export const gameInstanceMutations = (controller: GameInstanceController) => {
  const createGameInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) => {
      return controller.createGameInstance(args._id, context.user);
    }),
  );

  return { createGameInstance };
};
