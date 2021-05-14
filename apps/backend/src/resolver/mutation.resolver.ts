import { registerUser, loginUser, logoutUser, verifyUser, refreshAccessToken } from "../controller/auth.controller.ts";
import { createGame } from "../controller/game.controller.ts";
import { createInstance } from "../controller/gameInstance.controller.ts";

export const mutations = {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  refreshAccessToken,
  createGame,
  createInstance
};
