import { UserDatabase } from "../database/index.ts";
import { JwtUtils } from "../utils/index.ts";
import { Context, GQLError } from "../deps.ts";
import {
  AuthenticationContext,
  BaseContext,
  ErrorType,
} from "../models.ts";

type ResolverFn<T, C, R> = (resolver: Resolver<T, C>) => R;

interface Resolver<T, C> {
  parent: any;
  args: T;
  context: C;
  info: any;
}

const wrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
  return (...args: T): U => fn(...args);
};

export const gqlRequestWrapper = <T, R = any>(
  resolver: ResolverFn<T, BaseContext, R>,
) => {
  return wrap(
    (
      parent: any,
      args: T,
      context: BaseContext,
      info: any,
    ) => {
      return resolver({ parent, args, context, info });
    },
  );
};

export const requiresAuthentication = <T, R = any>(
  resolverFn: ResolverFn<T, AuthenticationContext, R>,
) => {
  return (resolver: Resolver<T, BaseContext>) => {
    const context = resolver.context;
    const user = context.user;

    if (!user) {
      throw new GQLError(ErrorType.UNAUTHORIZED);
    }

    return resolverFn({
      ...resolver,
      context: {
        ...context,
        user
      }
    });
  };
};

export const createContext = async (
  { request }: Context,
  users: UserDatabase,
) => {
  const context: BaseContext = {
    authenticated: false,
    user: undefined,
  };

  const requestToken = request.headers.get("Authorization");
  if (!requestToken) {
    return context;
  }  

  const requestTokenArray = requestToken.split(" ");
  const accessToken = requestTokenArray[1];

  try {
    const { email } = await JwtUtils.verifyAccessToken(accessToken);
    const user = await users.getUserByEmail(email);
    if (!user) {
      return context;
    }

    return {
      ...context,
      authenticated: true,
      user
    };
  } catch {
    return context;
  }
};
