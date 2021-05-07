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
    email: String
    name: String
    password: String
  }

  type ResolveType {
    done: Boolean
  }

  type ResolveLogin {
    token: String
  }

  type ResolveUser {
    name: String
  }

  extend type Query {
    getUser: ResolveUser!
  }

  extend type Mutation {
    registerUser(userRegister: UserRegister!): ResolveType!
    loginUser(userLogin: UserLogin!): ResolveLogin!
  }
`;
