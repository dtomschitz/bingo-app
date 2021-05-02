import { gql } from "../../deps.ts";
import { GameTypes } from "./game.types.ts";
import { UserTypes } from "./user.types.ts";

export const GraphQLSchema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${GameTypes}
  ${UserTypes}
`;
