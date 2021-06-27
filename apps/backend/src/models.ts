export * from "../../../libs/models/src/lib/auth.ts";
export * from "../../../libs/models/src/lib/bingo.ts";
export * from "../../../libs/models/src/lib/error.ts";

import { User } from "../../../libs/models/src/lib/auth.ts";

export interface ArgProps<T> {
  props: T;
}

export interface BaseContext {
  authenticated: boolean;
  user?: User;
}

export interface AuthenticationContext extends BaseContext {
  user: User;
}
