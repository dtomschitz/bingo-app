import { gql } from "../deps.ts";

export const gqlTypes = gql`
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

type Query {
  getUser: ResolveUser!
}

type Mutation {
  registerUser(userRegister: UserRegister!): ResolveType!
  loginUser(userLogin: UserLogin!): ResolveLogin!
}
`;