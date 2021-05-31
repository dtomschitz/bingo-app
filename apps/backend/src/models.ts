export * from "../../../libs/models/src/lib/auth.ts";
export * from "../../../libs/models/src/lib/bingo.ts";
export * from "../../../libs/models/src/lib/error.ts";

import { User } from "../../../libs/models/src/lib/auth.ts";


export interface GraphQLArgs<T> {
  props: T,
}

export interface GraphQLResolverContext {
  authenticated: boolean;
  user?: User
}