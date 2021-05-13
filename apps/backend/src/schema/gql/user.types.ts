import { gql } from "../../deps.ts";

export const UserTypes = gql`
  type User {
    email: String
    name: String
    password: String
  }

  input UserLogin {
    email: String
    password: String
  }

  input UserLogout {
    email: String
  }

  input UserRegister {
    name: String
    email: String
    password: String
  }

  input RefreshAccessTokenProps {
    email: String
    refreshToken: String
  }

  type AuthResult {
    user: User
    accessToken: String
    refreshToken: String
  }

  type UserLogoutResult {
    success: Boolean
  }

  type RefreshAccessTokenResult {
    accessToken: String
  }

  extend type Mutation {
    registerUser(props: UserRegister!): AuthResult!
    loginUser(props: UserLogin!): AuthResult!
    logoutUser(props: UserLogout!): UserLogoutResult!
    verifyUser(props: RefreshAccessTokenProps!): User!
    refreshAccessToken(props: RefreshAccessTokenProps!): RefreshAccessTokenResult!
  }
`;
