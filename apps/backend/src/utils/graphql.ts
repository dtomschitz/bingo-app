import { UserDatabase } from "../database/index.ts";
import { JwtUtils } from "../utils/index.ts";
import { Context, GQLError } from "../deps.ts";
import { ErrorType, GraphQLArgs, GraphQLResolverContext } from "../models.ts";

type ResolverFn<T, R> = (resolver: Resolver<T>) => R;

interface Resolver<T> {
  parent: any;
  props: T;
  context: GraphQLResolverContext;
  info: any;
}

const wrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
  return (...args: T): U => fn(...args);
};

export const gqlRequestWrapper = <T, R = any>(
  resolver: ResolverFn<T, R>,
) => {
  return wrap(
    (
      parent: any,
      args: GraphQLArgs<T>,
      context: GraphQLResolverContext,
      info: any,
    ) => {
      return resolver({ parent, props: args.props, context, info });
    },
  );
};

export const requiresAuthentication = <T, R = any>(
  resolverFn: ResolverFn<T, R>,
) => {
  return (resolver: Resolver<T>) => {
    if (!resolver.context.authenticated) {
      throw new GQLError(ErrorType.UNAUTHORIZED);
    }

    return resolverFn(resolver);
  };
};

export const createContext = async (
  { request }: Context,
  users: UserDatabase,
) => {
  const context: GraphQLResolverContext = {
    authenticated: false,
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
      user,
    };
  } catch {
    return context;
  }
};
