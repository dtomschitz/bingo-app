import { AuthController, GameController } from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import { CreateGame } from "../schema/index.ts";
import {
  AuthResult,
  CreateUserProps,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
} from "../models.ts";

export const authMutations = (controller: AuthController) => {
  const registerUser = gqlRequestWrapper<CreateUserProps, Promise<AuthResult>>((
    { props },
  ) => controller.registerUser(props));

  const loginUser = gqlRequestWrapper<LoginProps>((
    { props },
  ) => controller.loginUser(props));

  const logoutUser = gqlRequestWrapper<LogoutProps>((
    { props },
  ) => controller.logoutUser(props));

  const verifyUser = gqlRequestWrapper<RefreshAccessTokenProps>((
    { props },
  ) => controller.verifyUser(props));

  const refreshAccessToken = gqlRequestWrapper<RefreshAccessTokenProps>((
    { props },
  ) => controller.refreshAccessToken(props));

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    refreshAccessToken,
  };
};

export const gameMutations = (controller: GameController) => {
  const createGame = gqlRequestWrapper<CreateGame>(
    requiresAuthentication(({ context, props }) =>
      controller.createGame(context, props)
    ),
  );

  const createInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, props }) =>
      controller.createInstance(context, props._id)
    ),
  );

  return { createGame, createInstance };
};
