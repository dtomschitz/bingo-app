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

/**
 * Wrapps a service method to a resolver function.
 * 
 * @param resolver The function which should get executed by the specific resolver.
 * @returns The wrapped service method.
 */
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

/**
 * Checks if the current context contains a user.
 * 
 * @param resolverFn The resolver function which requires authentication in 
 * order to get called.
 * 
 * @returns The wrapped resolver function.
 */
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

/**
 * Modifies the current request context by adding a user if the header contains
 * a valid access token.
 * 
 * @param context The current request context. 
 * @param users The instance of the current user collection. 
 * 
 * @returns The modified context.
 */
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
      user: {
        ...user,
        _id: user._id.toHexString(),
      }
    } as BaseContext;
  } catch {        
    return context;
  }
};
