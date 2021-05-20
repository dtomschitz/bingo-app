import { UserDatabase } from "../database/index.ts";
import { JwtUtils, ValidationUtils } from "../utils/index.ts";
import { bcrypt, GQLError } from "../deps.ts";
import {
  AuthResult,
  CreateUserProps,
  ErrorType,
  LoginProps,
  LogoutProps,
  RefreshAccessTokenProps,
} from "../models.ts";

export class AuthController {
  constructor(private users: UserDatabase) {}

  async registerUser(props: CreateUserProps): Promise<AuthResult> {
    if (!props.email || !props.name || !props.password) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (!ValidationUtils.isPasswordValid(props.password)) {
      throw new GQLError(ErrorType.INVALID_PASSWORD_FORMAT);
    }

    const email = props.email.toLowerCase();
    if (!ValidationUtils.isEmailValid(email)) {
      throw new GQLError(ErrorType.INVALID_EMAIL_FORMAT);
    }

    if (await this.users.getUserByEmail(email)) {
      throw new GQLError(ErrorType.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(8);
    const password = await bcrypt.hash(props.password, salt);
    const user = await this.users.createUser({ ...props, password });

    if (!user) {
      throw new GQLError(ErrorType.USER_CREATION_FAILED);
    }

    const { accessToken, refreshToken } = await JwtUtils.generateTokens({
      _id: user._id,
      email: user.email,
    });

    await this.users.updateUser(user._id, { refreshToken });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs the `User` in and generates the authentication tokens which are required
   * for most of the endpoints. In the first step, the credentials are validated.
   * The authentication tokens are only generated if these are correct and belong
   * to a `User`.
   */
  async loginUser(props: LoginProps) {
    if (!props.email || !props.password) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    if (!ValidationUtils.isPasswordValid(props.password)) {
      throw new GQLError(ErrorType.INVALID_PASSWORD_FORMAT);
    }

    const email = props.email.toLowerCase();
    if (!ValidationUtils.isEmailValid(email)) {
      throw new GQLError(ErrorType.INVALID_EMAIL_FORMAT);
    }

    const user = await this.validateUser(email, props.password);
    const { accessToken, refreshToken } = await JwtUtils.generateTokens({
      _id: user._id,
      email: user.email,
    });

    await this.users.updateUser(user._id, { refreshToken });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logoutUser(props: LogoutProps) {
    if (!props.email) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const user = await this.users.getUserByEmail(props.email);
    if (!user) {
      throw new GQLError(ErrorType.USER_DOES_NOT_EXIST);
    }

    await this.users.updateUser(user._id, { refreshToken: undefined });

    return {
      success: true,
    };
  }

  /**
   * Refreshes the access token for the `User` with the given refresh token.
   */
  async verifyUser(props: RefreshAccessTokenProps) {
    if (!props.refreshToken) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
    if (!refreshTokenSecret) {
      throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
    }

    const { email } = await JwtUtils.verifyRefreshToken(props.refreshToken);
    const user = await this.users.getUserByEmail(email);

    return user;
  }

  /**
   * Refreshes the access token for the `User` with the given refresh token.
   */
  async refreshAccessToken(props: RefreshAccessTokenProps) {
    if (!props.refreshToken) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const refreshTokenSecret = Deno.env.get("REFRESH_TOKEN_SECRET");
    if (!refreshTokenSecret) {
      throw new GQLError(ErrorType.MISSING_JWT_TOKEN_SECRET);
    }

    const { _id, email } = await JwtUtils.verifyRefreshToken(
      props.refreshToken,
    );

    return {
      accessToken: JwtUtils.generateAccessToken({
        _id,
        email,
      }),
    };
  }

  /**
   * Validates the given credentials and looks for an `User` who is associated
   * with the email.
   *
   * @param email The email of the `User`.
   * @param password The password of the `User`.
   */
  async validateUser(email: string, password: string) {
    const user = await this.users.getUserByEmail(email);
    if (!user) {
      throw new GQLError(ErrorType.USER_DOES_NOT_EXIST);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new GQLError(ErrorType.INCORRECT_PASSWORD);
    }

    return user;
  }
}