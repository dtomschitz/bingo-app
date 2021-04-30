import { registerUser,loginUser } from "../controller/auth.controller.ts";

export const mutations = {
  registerUser: registerUser,
  loginUser: loginUser
}