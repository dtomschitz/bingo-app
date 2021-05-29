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
import { getDatabase } from "./common.ts";
import { AuthController } from "../src/controller/index.ts";
import { Database, UserDatabase } from "../src/database/index.ts";
import { ErrorType, LoginProps, RegisterProps } from "../src/models.ts";

import "https://deno.land/x/dotenv/load.ts";

describe("Authentication", () => {
  let database: Database;
  let users: UserDatabase;
  let controller: AuthController;

  const openConnection = () =>
    beforeAll(async () => {
      database = await getDatabase();
      users = new UserDatabase(database);
      await users.clear();

      controller = new AuthController(users);
    });

  const closeConnection = () =>
    afterAll(() => {
      database.close();
    });

  describe("registerUser", () => {

    openConnection();
    closeConnection();

    it("should fail because request is incorrect", async () => {
      const props: RegisterProps = {
        email: "",
        name: "",
        password: "",
      };

      await assertThrowsAsync(
        async () => await controller.registerUser(props),
        GQLError,
        ErrorType.INCORRECT_REQUEST,
      );
    });

    it("should fail because the given password is not valid", async () => {
      const props: RegisterProps = {
        email: "test@test.de",
        name: "Max Mustermann",
        password: "testPassword",
      };

      await assertThrowsAsync(
        async () => await controller.registerUser(props),
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
        async () => await controller.registerUser(props),
        GQLError,
        ErrorType.INVALID_EMAIL_FORMAT,
      );
    });

    it("should fail because the given email is alreay taken", async () => {
      await users.createUser({
        email: "test@test.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      });

      const props: RegisterProps = {
        email: "test@test.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      };

      await assertThrowsAsync(
        async () => await controller.registerUser(props),
        GQLError,
        ErrorType.USER_ALREADY_EXISTS,
      );
    });

    it("should create a new user and return the jwt tokens", async () => {
      const props: RegisterProps = {
        email: "test@hallo.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      };

      const result = await controller.registerUser(props);

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

    it("should fail because login request is incorrect", async () => {
      const props: LoginProps = {
        email: "",
        password: "",
      };

      await assertThrowsAsync(
        async () => await controller.loginUser(props),
        GQLError,
        ErrorType.INCORRECT_REQUEST,
      );
    });

    it("should fail because the given login password is invalid", async () => {
      const props: LoginProps = {
        email: "test@test.de",
        password: "dwadadawd",
      };

      await assertThrowsAsync(
        async () => await controller.loginUser(props),
        GQLError,
        ErrorType.INVALID_PASSWORD_FORMAT,
      );
    });

    it("should fail because the given email is invalid", async () => {
      const props: LoginProps = {
        email: "test@test.",
        password: "SuperSicheresPasswort#1337#%",
      };

      await assertThrowsAsync(
        async () => await controller.loginUser(props),
        GQLError,
        ErrorType.INVALID_EMAIL_FORMAT,
      );
    });

    it("should login the user and return the jwt tokens", async () => {
      await controller.registerUser({
        email: "test@hallo.de",
        name: "Max Mustermann",
        password: "SuperSicheresPasswort#1337#%",
      });

      const props: LoginProps = {
        email: "test@hallo.de",
        password: "SuperSicheresPasswort#1337#%",
      };

      const result = await controller.loginUser(props);

      assertExists(result.user._id);
      assertExists(result.accessToken);
      assertExists(result.refreshToken);

      assertEquals(result.user.email, props.email);
    });
  });
});
