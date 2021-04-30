import { registerUser, loginUser } from "../controller/auth.controller.ts";
import { createGame } from "../controller/game.controller.ts";

export const mutations = {
  registerUser: registerUser,
  loginUser: loginUser,
  createGame: createGame,
};
