import {
  createUser,
  getUserByEmail,
  updateUser,
} from "./../db/user.database.ts";
import { bcrypt, GQLError, jwt } from "../deps.ts";
import {
  CreateUserProps,
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
  context: any,
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
  context: any,
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
  context: any,
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
    success: true
  };
}

/**
 * Refreshes the access token for the `User` with the given refresh token.
 */
 export const verifyUser = async (
  parent: any,
  { props }: GraphQLProps<RefreshAccessTokenProps>,
  context: any,
  info: any,
) => {  
  if (!props.refreshToken) {
    throw new GQLError("Your request has the wrong format");
  }

  const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
  if (!refreshTokenSecret) {
    throw new GQLError("The refresh token secret can not be undefined!");
  }

  const { email } = await verifyToken(props.refreshToken, refreshTokenSecret);
  const user = await getUserByEmail(email);

  return user;
};

/**
 * Refreshes the access token for the `User` with the given refresh token.
 */
export const refreshAccessToken = async (
  parent: any,
  { props }: GraphQLProps<RefreshAccessTokenProps>,
  context: any,
  info: any,
) => {
  if (!props.refreshToken) {
    throw new GQLError("Your request has the wrong format");
  }

  const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
  if (!refreshTokenSecret) {
    throw new GQLError("The refresh token secret can not be undefined!");
  }

  const { _id, email } = await verifyToken(props.refreshToken, refreshTokenSecret);

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
const validateUser = async (email: string, password: string) => {
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
  return generateToken(
    {
      _id: payload._id,
      email: payload.email,
    },
    {
      secret: Deno.env.get("ACCESS_TOKEN_SECRET"),
      expiration: 3600, // 1h
    },
  );
};

/**
 * Generates the refresh token.
 *
 * @param payload The payload which contains the email and the password.
 */
const generateRefreshToken = (payload: JwtPayload) => {
  return generateToken(
    {
      _id: payload._id,
      email: payload.email,
    },
    {
      secret: Deno.env.get("REFRESH_TOKEN_SECRET"),
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
  if (!options.secret) {
    throw new GQLError("The secret can not be undefined!");
  }

  return jwt.create(header, {
    ...payload,
    exp: jwt.getNumericDate(options.expiration)
  }, options.secret);
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret, header.alg) as Promise<JwtVerify>;
}

/*//MUTATE { email: "x-email", name: "x-name", password: "x-password" }
export const registerUser = async (parent: any, { userRegister }: any, context: any, info: any) => {
  const requestData: any = userRegister;
  if (!requestData.email || !requestData.name || !requestData.password) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  const emailLowerCase = emailToLowerCase(requestData.email as string);
  if (!isPasswordValid(requestData.password)) {
    throw new GQLError({ message: "Your password needs a minimum of eight characters, at least one letter, one number and a special character" });
  }

  if (!isEmailValid(emailLowerCase)) {
    throw new GQLError({ message: "Invalid email!" });
  }

  if (await getUserFromDb(emailLowerCase)) {
    throw new GQLError("This User already exists");
  }

  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(requestData.password, salt);
  const uid = await addUserToDb({ name: requestData.name, email: emailLowerCase, password: hash });
  console.log("uid", uid);


  if (uid) {
    return { done: true };
  } else {
    throw new GQLError("Something went wrong");
  }
};

export const loginUser = async (parent: any, { userLogin }: any, context: any, info: any) => {
  const requestData: any = userLogin;

  if (!requestData.email || !requestData.password) {
    throw new GQLError({ message: "Your request has the wrong format" });
  }

  const emailLowerCase = emailToLowerCase(requestData.email as string);

  if (!isPasswordValid(requestData.password)) {
    throw new GQLError({ message: "Invalid password!" });
  }

  if (!isEmailValid(emailLowerCase)) {
    throw new GQLError({ message: "Invalid email!" });
  }

  const user: UserSchema | null = await doesUserExist(
    emailLowerCase
  );

  if (!user) {
    throw new GQLError({ message: "This user does not exist!" });
  }

  const result = await bcrypt.compare(requestData.password, user.password);
  if (!result) {
    throw new GQLError({ message: "Wrong password!" });
  }

  
  const payloadWithUser = {
    ...payload,
    email: emailLowerCase,
  };

  const JWT_SECRET: string | undefined = Deno.env.get("JWT_SECRET");

  if (!JWT_SECRET) {
    throw new GQLError({ message: "Could not generate Token!" });
  }
  const jwt = await create(header, payloadWithUser, JWT_SECRET);
  console.log("jwt created");
  return { token: jwt };
};

export const validateAuth = async (context: any) => {
  const requestToken: string = context.request.headers.get("Authorization");

  if (!requestToken) {
    return { success: false, status: 403, body: "Auth token required!" };
  }

  try {
    const requestTokenArray = requestToken.split(" ");

    const requestJwtToken = requestTokenArray[1];

    const JWT_SECRET: string | undefined = Deno.env.get("JWT_SECRET");

    if (!JWT_SECRET) {
      return { success: false, status: 403, body: "Could not verify Token!" };
    }

    const jwtData: any = await verify(requestJwtToken, JWT_SECRET, header.alg);

    if (!jwtData.exp) {
      return { success: false, status: 403, body: "Token is corrupt" };
    }

    if (jwtData.exp <= Date.now()) {
      return { success: false, status: 400, body: "Token expired!" };
    }

    return { success: true, email: jwtData.email };
  } catch (error) {
    return { success: false, status: 400, body: "Invalid Token" };
  }
};

export const getUser = async (parent: any, { }: any, context: any, info: any) => {
  const response: any = await validateAuth(context);

  if (!response.success || !response.email) {
    throw new GQLError({ message: response.body });
  }

  const userData = await getUserFromDb(response.email);

  if (!userData) {
    throw new GQLError({ message: "User does not exist!" });
  }
  return { name: userData.name };
};
*/
