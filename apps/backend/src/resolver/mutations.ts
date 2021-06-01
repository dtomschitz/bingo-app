import { AuthController, GameController } from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import {
  AuthResult,
  CreateGameProps,
  CreateUserProps,
  LoginProps,
  RefreshAccessTokenProps,
} from "../models.ts";

export const authMutations = (controller: AuthController) => {
  const registerUser = gqlRequestWrapper<CreateUserProps, Promise<AuthResult>>((
    { args: { props } },
  ) => controller.registerUser(props));

  const loginUser = gqlRequestWrapper<LoginProps>((
    { args: { props } },
  ) => controller.loginUser(props));

  const logoutUser = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args: { props } },
  ) => controller.logoutUser(props));

  const verifyUser = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args: { props } },
  ) => controller.verifyUser(props));

  const refreshAccessToken = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args: { props } },
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
  const createGame = gqlRequestWrapper<CreateGameProps>((
    { context, args: { props } },
  ) => {
    return requiresAuthentication(context, () => controller.createGame(props))
  });

  return { createGame };
};
