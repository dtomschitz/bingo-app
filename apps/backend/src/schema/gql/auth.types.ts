import { gql } from '../../deps.ts';

export const AuthTypes = gql`
  input UserRegister {
    name: String
    email: String
    password: String
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
    loginUser(email: String!, password: String!): AuthResult!
    logoutUser(email: String!): Boolean!
    verifyUser(refreshToken: String!): User!
    refreshAccessToken(refreshToken: String!): String!
  }
`;
