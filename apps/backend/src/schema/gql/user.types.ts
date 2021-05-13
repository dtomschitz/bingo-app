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

  input UserRegister {
    name: String
    email: String
    password: String
  }

  input RefreshAccessTokenProps {
    refreshToken: String
  }

  type AuthResult {
    user: User
    accessToken: String
    refreshToken: String
  }

  type RefreshAccessTokenResult {
    user: User
    accessToken: String
  }

  extend type Mutation {
    registerUser(props: UserRegister!): AuthResult!
    loginUser(props: UserLogin!): AuthResult!
    verifyUser(props: RefreshAccessTokenProps!): User!
    refreshAccessToken(props: RefreshAccessTokenProps!): RefreshAccessTokenResult!
  }
`;
