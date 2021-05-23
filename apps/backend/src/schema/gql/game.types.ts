import { gql } from "../../deps.ts";

export const GameTypes = gql`

  input CreateGame {
    title: String!
    fields: [String!]!
  }

  extend type Query {
    games: [BingoGame!]!
    game(_id: ID!): BingoGame!
    instance(_id: ID!): [Field!]!
  }

  extend type Mutation {
    createGame(input: CreateGame!): BingoGame!
    createInstance(_id: ID!): [Field!]!
  }

  type BingoGame {
    _id: ID
    title: String!
    fields: [Field!]!
    instance: [Field]
  }

  type Field {
    _id: ID
    text: String
  }
`;
