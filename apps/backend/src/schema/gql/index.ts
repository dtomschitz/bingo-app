import { gql } from "../../deps.ts";
import { AuthTypes } from "./auth.types.ts";
import { GameTypes } from "./game.types.ts";
import { UserTypes } from "./user.types.ts";

/**
 * Contains all queries and mutations
 */
export const GraphQLSchema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${GameTypes}
  ${UserTypes}
  ${AuthTypes}
`;
