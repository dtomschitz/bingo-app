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
    phase: GamePhase
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
    checked: Boolean
  }

  input FieldChanges {
    text: String
    checked: Boolean
  }

  input ValidateWin {
    _id: ID!
    fieldIds: [String!]!
  }

  extend type Query {
    games: [BingoGame!]!
    game(_id: ID!): BingoGame!
    instance(_id: ID!): BingoGame!
    validateWin(props: ValidateWin!): Boolean!
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
    phase: GamePhase!
    fields: [BingoField!]!
    instanceFields: [BingoInstanceField!]!
    hasInstance: Boolean
    podium: [Podium!]
  }

  type Podium {
    name: String
    placement: Int
  }

  type BingoField {
    _id: ID
    text: String
    checked: Boolean
  }

  type BingoInstanceField {
    _id: ID
    text: String
    selected: Boolean
  }

  enum GamePhase {
    EDITING,
    OPEN,
    PLAYING,
    FINISHED
  }

  enum MutationType {
    CREATE
    UPDATE
    DELETE
  }
`;
