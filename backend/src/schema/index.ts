import { gql } from "../deps.ts";
import { GameTypes } from "./game.types.ts";

export const Schema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${GameTypes}
`;
