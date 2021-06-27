import { gql } from '../../deps.ts';

/**
 * Contains all the necessary gql types and inputs for the auth specific 
 * queries and mutations.
 */
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
