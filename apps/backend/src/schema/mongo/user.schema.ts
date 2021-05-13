import { User } from "../../models.ts";

export interface UserSchema extends User {
  accessToken: string;
  refreshToken: string
}