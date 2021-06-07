import { gql } from "../../deps.ts";

export const GameTypes = gql`

  input CreateGame {
    title: String!
    fields: [String!]!
  }

  input UpdateGame {
    _id: ID!
    changes: GameChanges!
  }

  input GameChanges {
    title: String
    fields: [UpdateBingoField]
  }

  input UpdateBingoField {
    _id: ID
    text: String
    checked: Boolean
  }

  input MutateGameField {
    _id: ID!
    mutation: MutateField!
  }

  input MutateField {
    type: MutationType
    _id: ID!
    text: String
    changes: FieldChanges
  }
 
  input FieldChanges {
    text: String
    checked: Boolean
  }

  extend type Query {
    games: [BingoGame!]!
    game(_id: ID!): BingoGame!
    instance(_id: ID!): BingoGame!
  }

  extend type Mutation {
    createGame(props: CreateGame!): BingoGame!
    updateGame(props: UpdateGame!): BingoGame!
    deleteGame(_id: ID!): Boolean!
    createGameInstance(_id: ID!): BingoGame!
    mutateField(props: MutateGameField!): Boolean!
  }

  type BingoGame {
    _id: ID
    authorId: String!
    title: String!
    phase: String!
    fields: [BingoField!]!
    hasInstance: Boolean
  }

  type BingoField {
    _id: ID
    text: String
  }

  enum MutationType {
    CREATE
    UPDATE
    DELETE
  }
`;
