import { AuthService, GameService } from "../service/index.ts";
import { gqlRequestWrapper, requiresAuthentication } from "../utils/index.ts";
import {
  ArgProps,
  CreateGame,
  CreateUserProps,
  LoginProps,
  LogoutProps,
  MutateGameField,
  RefreshAccessTokenProps,
  UpdateGame,
  EditUser
} from "../models.ts";

export const authMutations = (service: AuthService) => {
  const registerUser = gqlRequestWrapper<ArgProps<CreateUserProps>>((
    { args },
  ) => service.registerUser(args.props));

  const loginUser = gqlRequestWrapper<LoginProps>((
    { args },
  ) => service.loginUser(args.email, args.password));

  const logoutUser = gqlRequestWrapper<LogoutProps>((
    { args },
  ) => service.logoutUser(args.email));

  const verifyUser = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args },
  ) => service.verifyUser(args.refreshToken));

  const refreshAccessToken = gqlRequestWrapper<RefreshAccessTokenProps>((
    { args },
  ) => service.refreshAccessToken(args.refreshToken));

  const editUser = gqlRequestWrapper<ArgProps<EditUser>>((
    { args },
  ) => service.editUser(args.props));

  return {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    refreshAccessToken,
    editUser
  };
};

export const gameMutations = (service: GameService) => {
  const createGame = gqlRequestWrapper<ArgProps<CreateGame>>(
    requiresAuthentication(({ context, args }) =>
      service.createGame(args.props, context.user)
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

  const deleteGame = gqlRequestWrapper<{ _id: string }>(
    requiresAuthentication(({ args }) => service.deleteGame(args._id)),
  );

  const mutateField = gqlRequestWrapper<ArgProps<MutateGameField>>(
    requiresAuthentication(({ args }) =>
      service.mutateGameField(args.props._id, args.props.mutation)
    ),
  );

  return {
    createGame,
    createGameInstance,
    updateGame,
    deleteGame,
    mutateField,
  };
};
