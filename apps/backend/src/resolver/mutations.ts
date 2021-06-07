import {
  AuthController,
  GameController,
  GameInstanceController,
} from "../controller/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import {
  ArgProps,
  CreateGame,
  UpdateGame,
  CreateUserProps,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
  MutateGameField
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
  const createGame = gqlRequestWrapper<ArgProps<CreateGame>>(
    requiresAuthentication(({ context, args }) =>
      controller.createGame(args.props, context.user)
    ),
  );

  const updateGame = gqlRequestWrapper<ArgProps<UpdateGame>>(
    requiresAuthentication(({ args }) =>
      controller.updateGame(args.props)
    ),
  );

  const deleteGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ args }) =>
      controller.deleteGame(args._id)
    ),
  );

  const mutateField = gqlRequestWrapper<ArgProps<MutateGameField>>(
    requiresAuthentication(({ args }) =>
      controller.mutateGameField(args.props._id, args.props.mutation)
    ),
  );

  return { createGame, updateGame, deleteGame, mutateField};
};

export const gameInstanceMutations = (controller: GameInstanceController) => {
  const createGameInstance = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ context, args }) => {
      return controller.createGameInstance(args._id, context.user);
    }),
  );

  return { createGameInstance };
};
