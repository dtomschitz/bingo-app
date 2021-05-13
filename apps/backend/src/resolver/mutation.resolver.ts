import { registerUser, loginUser, verifyUser, refreshAccessToken } from "../controller/auth.controller.ts";
import { createGame } from "../controller/game.controller.ts";

export const mutations = {
  registerUser,
  loginUser,
  verifyUser,
  refreshAccessToken,
  createGame,
};
