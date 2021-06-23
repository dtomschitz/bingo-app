import {
  afterAll,
  assertEquals,
  assertExists,
  assertThrowsAsync,
  beforeAll,
  describe,
  GQLError,
  it,
} from "./test.deps.ts";
import { defaultInvalidRequestTest, getDatabase } from "./common.ts";
import { AuthService } from "../src/service/index.ts";
import { Database, UserDatabase } from "../src/database/index.ts";
import {
  CreateUserProps,
  ErrorType,
  RegisterProps,
} from "../src/models.ts";

import "https://deno.land/x/dotenv/load.ts";

describe("Authentication", () => {
  let database: Database;
  let users: UserDatabase;
  let service: AuthService;

  const openConnection = () =>
    beforeAll(async () => {
      database = await getDatabase();
      users = new UserDatabase(database);
      await users.clear();

      service = new AuthService(users);
    });

  const closeConnection = () =>
    afterAll(() => {
      database.close();
    });

  const registerDefaultUser = async (props?: CreateUserProps) => {
    const defaultProps: CreateUserProps = {
      email: "test@test.de",
      name: "Max Mustermann",
      password: "SuperSicheresPasswort#1337#%",
    };

    const result = await service.registerUser(props ?? defaultProps);

    return { props: props ?? defaultProps, result };
  };

  describe("registerUser", () => {
    openConnection();
    closeConnection();

    defaultInvalidRequestTest(
      "should fail because request is incorrect",
      () =>
        service.registerUser({
          email: "",
          name: "",
          password: "",
        }),
    );

    it("should fail because the given password is not valid", async () => {
      const props: RegisterProps = {
        email: "test@test.de",
        name: "Max Mustermann",
        password: "testPassword",
      };

      await assertThrowsAsync(
        async () => await service.registerUser(props),
        GQLError,
        ErrorType.INVALID_PASSWORD_FORMAT,
      );
    });

    it("should fail because the given email is not valid", async () => {
      const props: RegisterProps = {
        email: "test@test.",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      };

      await assertThrowsAsync(
        async () => await service.registerUser(props),
        GQLError,
        ErrorType.INVALID_EMAIL_FORMAT,
      );
    });

    it("should fail because the given email is alreay taken", async () => {
      await users.createUser({
        email: "test@hallo.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      });

      const props: RegisterProps = {
        email: "test@hallo.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      };

      await assertThrowsAsync(
        async () => await service.registerUser(props),
        GQLError,
        ErrorType.USER_ALREADY_EXISTS,
      );
    });

    it("should create a new user and return the jwt tokens", async () => {
      const { result, props } = await registerDefaultUser();

      assertExists(result.user._id);
      assertExists(result.accessToken);
      assertExists(result.refreshToken);

      assertEquals(result.user.email, props.email);
      assertEquals(result.user.name, props.name);
    });
  });

  describe("loginUser", () => {
    openConnection();
    closeConnection();

    defaultInvalidRequestTest(
      "should fail because login request is incorrect",
      () => service.loginUser("", ""),
    );

    it("should fail because the given login password is invalid", async () => {
      await assertThrowsAsync(
        async () => await service.loginUser("test@test.de", "dwadadawd"),
        GQLError,
        ErrorType.INVALID_PASSWORD_FORMAT,
      );
    });

    it("should fail because the given email is invalid", async () => {
      await assertThrowsAsync(
        async () => await service.loginUser("test@test.", "SuperSicheresPasswort#1337#%"),
        GQLError,
        ErrorType.INVALID_EMAIL_FORMAT,
      );
    });

    it("should login the user and return the jwt tokens", async () => {
      const { props } = await registerDefaultUser();
      const result = await service.loginUser(props.email, props.password);

      assertExists(result.user._id);
      assertExists(result.accessToken);
      assertExists(result.refreshToken);

      assertEquals(result.user.email, props.email);
    });
  });

  describe("logoutUser", () => {
    openConnection();
    closeConnection();

    defaultInvalidRequestTest(
      "should fail because logout request is incorrect",
      () => service.logoutUser(""),
    );

    it("should fail because no use is associated with the given email", async () => {
      await assertThrowsAsync(
        async () => await service.logoutUser("logouttest@test.de"),
        GQLError,
        ErrorType.USER_DOES_NOT_EXIST,
      );
    });

    it("should logout the user with the given email", async () => {
      const { props: { email } } = await registerDefaultUser();
      const result = await service.logoutUser(email);

      assertEquals(result, true);
    });
  });

  describe("verifyUser", () => {
    openConnection();
    closeConnection();

    defaultInvalidRequestTest(
      "should fail because request is incorrect",
      () => service.verifyUser(""),
    );

    it("should fail because the refresh token is serialized wrong", async () => {
      await assertThrowsAsync(
        async () => await service.verifyUser("invalid_refresh_token"),
        GQLError,
        ErrorType.INVALID_SERIALIZED_JWT_TOKEN,
      );
    });

    it("should verify the user based on the given refresh token", async () => {
      const { result } = await registerDefaultUser();
      const user = await service.verifyUser(result.refreshToken);

      assertEquals(user._id, result.user._id);
      assertEquals(user.name, result.user.name);
      assertEquals(user.email, result.user.email);
      assertEquals(user.refreshToken, result.refreshToken);
    });
  });

  describe("refreshAccessToken", () => {
    openConnection();
    closeConnection();

    defaultInvalidRequestTest(
      "should fail because request is incorrect",
      () => service.refreshAccessToken(""),
    );

    it("should fail because the refresh token is serialized wrong", async () => {
      await assertThrowsAsync(
        async () => await service.refreshAccessToken("invalid_refresh_token"),
        GQLError,
        ErrorType.INVALID_SERIALIZED_JWT_TOKEN,
      );
    });

    it("should refresh the access token with the given refresh token", async () => {
      const { result: { refreshToken } } = await registerDefaultUser();
      const result = await service.refreshAccessToken(refreshToken);

      assertExists(result);
    });
  });

  describe("validateUser", () => {
    openConnection();
    closeConnection();

    it("should fail because there is no user with this email", async () => {
      const email = "test@test.de";
      const password = "SuperSicheresPasswort#1337#%";

      await assertThrowsAsync(
        async () => await service.validateUser(email, password),
        GQLError,
        ErrorType.USER_DOES_NOT_EXIST,
      );
    });

    it("should fail because the password is incorrect", async () => {
      await registerDefaultUser();

      const email = "test@test.de";
      const password = "SuperSicheresFalschesPasswort#1337#%";

      await assertThrowsAsync(
        async () => await service.validateUser(email, password),
        GQLError,
        ErrorType.INCORRECT_PASSWORD,
      );
    });

    it("should validate the user with the given email and password", async () => {
      const result = await service.registerUser({
        email: "test.test@test.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      });

      const email = "test.test@test.de";
      const password = "SuperSicheresPasswort#1337#%";
      const user = await service.validateUser(email, password);

      assertEquals(user._id, result.user._id);
      assertEquals(user.email, result.user.email);
      assertEquals(user.name, result.user.name);
    });
  });
});
