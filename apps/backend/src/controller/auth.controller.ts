import {
  createUser,
  getUserByEmail,
  updateUser,
} from "./../db/user.database.ts";
import { bcrypt, Context, GQLError, jwt } from "../deps.ts";
import {
  CreateUserProps,
  ErrorType,
  GraphQLProps,
  JwtPayload,
  JwtSignOptions,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
} from "../models.ts";

type JwtVerify = JwtPayload & jwt.Payload;

const header: jwt.Header = {
  alg: "HS256",
  typ: "JWT",
};

const isPasswordValid = (password: string) => {
  const passwordRegex = RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
  );

  return passwordRegex.test(password);
};

const isEmailValid = (email: string) => {
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  );

  return emailRegex.test(email);
};

export const registerUser = async (
  parent: any,
  { props }: GraphQLProps<CreateUserProps>,
  context: Context,
  info: any,
) => {
  if (!props.email || !props.name || !props.password) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  if (!isPasswordValid(props.password)) {
    throw new GQLError(
      "Your password needs a minimum of eight characters, at least one letter, one number and a special character",
    );
  }

  const email = props.email.toLowerCase();
  if (!isEmailValid(email)) {
    throw new GQLError("Invalid email!");
  }

  if (await getUserByEmail(email)) {
    throw new GQLError("This User already exists");
  }

  const salt = await bcrypt.genSalt(8);
  const password = await bcrypt.hash(props.password, salt);
  const user = await createUser({ ...props, password });

  if (!user) {
    throw new GQLError("Failed to create the new user!");
  }

  const { accessToken, refreshToken } = await generateTokens({
    _id: user._id,
    email: user.email,
  });

  await updateUser(user._id, { refreshToken });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Logs the `User` in and generates the authentication tokens which are required
 * for most of the endpoints. In the first step, the credentials are validated.
 * The authentication tokens are only generated if these are correct and belong
 * to a `User`.
 */
export const loginUser = async (
  parent: any,
  { props }: GraphQLProps<LoginProps>,
  context: Context,
  info: any,
) => {
  if (!props.email || !props.password) {
    throw new GQLError("Your request has the wrong format");
  }

  if (!isPasswordValid(props.password)) {
    throw new GQLError({ message: "Invalid password!" });
  }

  const email = props.email.toLowerCase();
  if (!isEmailValid(email)) {
    throw new GQLError({ message: "Invalid email!" });
  }

  const user = await validateUser(email, props.password);
  const { accessToken, refreshToken } = await generateTokens({
    _id: user._id,
    email: user.email,
  });

  await updateUser(user._id, { refreshToken });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (
  parent: any,
  { props }: GraphQLProps<LogoutProps>,
  context: Context,
  info: any,
) => {
  if (!props.email) {
    throw new GQLError("Your request has the wrong format");
  }

  const user = await getUserByEmail(props.email);
  if (!user) {
    throw new GQLError("This user does not exist!");
  }

  await updateUser(user._id, { refreshToken: undefined });

  return {
    success: true,
  };
};

/**
 * Refreshes the access token for the `User` with the given refresh token.
 */
export const verifyUser = async (
  parent: any,
  { props }: GraphQLProps<RefreshAccessTokenProps>,
  context: Context,
  info: any,
) => {
  if (!props.refreshToken) {
    throw new GQLError("Your request has the wrong format");
  }

  const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
  if (!refreshTokenSecret) {
    throw new GQLError("The refresh token secret can not be undefined!");
  }

  const { email } = await verifyRefreshToken(props.refreshToken);
  const user = await getUserByEmail(email);

  return user;
};

/**
 * Refreshes the access token for the `User` with the given refresh token.
 */
export const refreshAccessToken = async (
  parent: any,
  { props }: GraphQLProps<RefreshAccessTokenProps>,
  context: Context,
  info: any,
) => {
  if (!props.refreshToken) {
    throw new GQLError("Your request has the wrong format");
  }

  const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
  if (!refreshTokenSecret) {
    throw new GQLError("The refresh token secret can not be undefined!");
  }

  const { _id, email } = await verifyToken(
    props.refreshToken,
    "refresh",
  );

  return {
    accessToken: generateAccessToken({
      _id,
      email,
    }),
  };
};

/**
 * Validates the given credentials and looks for an `User` who is associated
 * with the email.
 *
 * @param email The email of the `User`.
 * @param password The password of the `User`.
 */
export const validateUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new GQLError("This user does not exist!");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new GQLError("Invalid password!");
  }

  return user;
};

export const validateAuthentication = async (context: Context) => {
  const requestToken = context.request.headers.get("Authorization");
  if (!requestToken) {
    context.throw(403, "The access token is required!");
  }

  const requestTokenArray = requestToken.split(" ");
  const accessToken = requestTokenArray[1];

  try {
    const { email } = await verifyAccessToken(accessToken);
    const user = getUserByEmail(email);
    if (!user) {
      throw new GQLError(ErrorType.UNKNONW_USER);
    }
  
    return user;

  } catch(_) {
    throw new GQLError(ErrorType.UNAUTHORIZED);
  }
};

/**
 * Generates the authentication tokens.
 *
 * @param payload The payload which contains the email and the password.
 */
const generateTokens = async (payload: JwtPayload) => {
  return {
    accessToken: await generateAccessToken(payload),
    refreshToken: await generateRefreshToken(payload),
  };
};

/**
 * Generates the access token.
 *
 * @param payload The payload which contains the email and the password.
 */
const generateAccessToken = (payload: JwtPayload) => {
  const secret = Deno.env.get("ACCESS_TOKEN_SECRET");
  if (!secret) {
    throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
  }

  return generateToken(
    {
      _id: payload._id,
      email: payload.email,
    },
    {
      secret,
      //expiration: 3600, // 1h
      expiration: 60
    },
  );
};

/**
 * Generates the refresh token.
 *
 * @param payload The payload which contains the email and the password.
 */
const generateRefreshToken = (payload: JwtPayload) => {
  const secret = Deno.env.get("REFRESH_TOKEN_SECRET");
  if (!secret) {
    throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
  }

  return generateToken(
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

/**
 * Generates a new jwt token based on the given options.
 *
 * @param payload The payload which will be assigned to the jwt token.
 * @param options The options for the signing process.
 */
const generateToken = (payload: jwt.Payload, options: JwtSignOptions) => {
  return jwt.create(header, {
    ...payload,
    exp: jwt.getNumericDate(options.expiration),
  }, options.secret);
};

const verifyAccessToken = (token: string) => {
  return verifyToken(token, "access");
};

const verifyRefreshToken = (token: string) => {
  return verifyToken(token, "refresh");
};

const verifyToken = (
  token: string,
  type: "access" | "refresh",
) => {
  const secret = Deno.env.get(
    type === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET",
  );
  if (!secret) {
    throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
  }

  return jwt.verify(token, secret, header.alg) as Promise<JwtVerify>;
};
