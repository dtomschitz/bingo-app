import { gql } from "../../deps.ts";

export const GameTypes = gql`

  input CreateGame {
    title: String!
    fields: [String!]!
  }

  extend type Query {
    games: [BingoGame!]!
    game(_id: ID!): BingoGame!
    instance(_id: ID!): BingoGame!
  }

  extend type Mutation {
    createGame(props: CreateGame!): BingoGame!
    createGameInstance(_id: ID!): BingoGame!
  }

  type BingoGame {
    _id: ID
    authorId: String!
    title: String!
    fields: [Field!]!
    hasInstance: Boolean
  }

  type Field {
    _id: ID
    text: String
  }
`;
