import { GQLError, jwt } from "../deps.ts";
import { ErrorType, JwtPayload, JwtSignOptions } from "../models.ts";

type JwtVerify = JwtPayload & jwt.Payload;

export const defaultJwtHeader: jwt.Header = {
  alg: "HS256",
  typ: "JWT",
};

export class JwtUtils {
  /**
   * Generates the authentication tokens.
   *
   * @param payload The payload which contains the email and the password.
   */
  static generateTokens = async (payload: JwtPayload) => {
    return {
      accessToken: await JwtUtils.generateAccessToken(payload),
      refreshToken: await JwtUtils.generateRefreshToken(payload),
    };
  };

  /**
   * Generates the access token.
   *
   * @param payload The payload which contains the email and the password.
   */
  static generateAccessToken = (payload: JwtPayload) => {
    const secret = Deno.env.get("ACCESS_TOKEN_SECRET");
    if (!secret) {
      throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
    }

    return JwtUtils.generateToken(
      {
        _id: payload._id,
        email: payload.email,
      },
      {
        secret,
        expiration: 3600, // 1h
      },
    );
  };

  /**
   * Generates the refresh token.
   *
   * @param payload The payload which contains the email and the password.
   */
  static generateRefreshToken = (payload: JwtPayload) => {
    const secret = Deno.env.get("REFRESH_TOKEN_SECRET");
    if (!secret) {
      throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
    }

    return JwtUtils.generateToken(
      {
        _id: payload._id,
        email: payload.email,
      },
      {
        secret,
        expiration: 2628000, // 30d
      },
    );
  };

  static verifyAccessToken = (token: string) => {
    return JwtUtils.verifyToken(token, "access");
  };

  static verifyRefreshToken = (token: string) => {
    return JwtUtils.verifyToken(token, "refresh");
  };

  /**
   * Generates a new jwt token based on the given options.
   *
   * @param payload The payload which will be assigned to the jwt token.
   * @param options The options for the signing process.
   */
  private static generateToken = (
    payload: jwt.Payload,
    options: JwtSignOptions,
  ) => {
    return jwt.create(defaultJwtHeader, {
      ...payload,
      exp: jwt.getNumericDate(options.expiration),
    }, options.secret);
  };

  private static verifyToken = async (
    token: string,
    type: "access" | "refresh",
  ) => {
    const secret = Deno.env.get(
      type === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET",
    );
    if (!secret) {
      throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
    }

    let verify: jwt.Payload;
    try {
      verify = await jwt.verify(token, secret, defaultJwtHeader.alg);
    } catch {            
      throw new GQLError(ErrorType.INVALID_SERIALIZED_JWT_TOKEN);
    }

    return verify as JwtVerify;
  };
}
