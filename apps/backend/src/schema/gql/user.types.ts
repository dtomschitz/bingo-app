import { gql } from "../../deps.ts";

/**
 * Contains all the necessary gql types and inputs for the user specific 
 * queries and mutations.
 */
export const UserTypes = gql`
  type User {
    _id: String
    email: String
    name: String
    password: String
  }

  input UpdateUser {
    _id: ID!
    changes: UserChanges!
  }

  input UserChanges {
    name: String
    email: String
    password: String
  }

  extend type Mutation {
    updateUser(props: UpdateUser!): User!
    deleteUser(_id: ID!): Boolean!
  }
`;
