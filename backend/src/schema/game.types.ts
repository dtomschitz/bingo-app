import { gql } from "../deps.ts";

export const GameTypes = gql`
  type BingoGame {
    _id: ID
    title: String!
    fields: [BingoField!]!
  }

  type BingoField {
    _id: ID
    id: String!
    text: String!
  }

  input BingoGameInput {
    title: String!
    fields: [BingoField!]!
  }

  extend type Query {
    getGame(_id: ID): BingoGame
  }

  extend type Mutation {
    createGame(input: BingoGameInput): BingoGame
  }
`;
