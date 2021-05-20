import { gql } from "../../deps.ts";

export const GameTypes = gql`
  input CreateBingoField {
    _id: ID!
    text: String!
  }

  input CreateGame {
    title: String!
    fields: [CreateBingoField]
  }

  extend type Query {
    games: [BingoGame!]!
    game(_id: ID!): BingoGame!
  }

  extend type Mutation {
    createGame(input: CreateGame!): BingoGame!
  }

  type BingoGame {
    _id: ID
    title: String!
    fields: [BingoField!]!
  }

  type BingoField {
    _id: ID
    text: String!
  }
`;
