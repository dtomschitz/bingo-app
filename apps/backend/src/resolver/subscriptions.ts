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
const GAME_STATE = "GAME_STATE";

export const gameSubscriptions = () => {

  const gameState = gqlRequestWrapper<ArgProps<CreateUserProps>>((
    { context, args },
  ) => {
    console.log("test");
    context.pubsub.publish();
    return "asdf";
  });

  return {
    gameState: {
      subscribe: (_:any, __:any, {pubsub}:any) => pubsub.asyncIterator(GAME_STATE)
    },
    test: gameState
  };
}
