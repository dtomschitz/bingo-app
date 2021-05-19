import { AuthController, GameController } from "../controller/index.ts";
import { Context } from "../deps.ts";
import {
  CreateGameProps,
  CreateUserProps,
  GraphQLProps,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
} from "../models.ts";

export const authMutations = (controller: AuthController) => {
  const registerUser = (
    parent: any,
    { props }: GraphQLProps<CreateUserProps>,
    context: Context,
    info: any,
  ) => controller.registerUser(props);

  const loginUser = (
    parent: any,
    { props }: GraphQLProps<LoginProps>,
    context: Context,
    info: any,
  ) => controller.loginUser(props);

  const logoutUser = async (
    parent: any,
    { props }: GraphQLProps<LogoutProps>,
    context: Context,
    info: any,
  ) => await controller.logoutUser(props);

  const verifyUser = async (
    parent: any,
    { props }: GraphQLProps<RefreshAccessTokenProps>,
    context: Context,
    info: any,
  ) => await controller.verifyUser(props);

  const refreshAccessToken = async (
    parent: any,
    { props }: GraphQLProps<RefreshAccessTokenProps>,
    context: Context,
    info: any,
  ) => await controller.refreshAccessToken(props);

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    refreshAccessToken,
  };
};

export const gameMutations = (controller: GameController) => {
  const createGame = async (
    parent: any,
    { props }: GraphQLProps<CreateGameProps>,
    context: Context,
    info: any,
  ) => await controller.createGame(props);

  return { createGame };
};
