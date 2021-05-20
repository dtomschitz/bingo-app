import {
  afterAll,
  assertThrowsAsync,
  beforeAll,
  describe,
  GQLError,
  it
} from "./test.deps.ts";
import { AuthController } from "../src/controller/index.ts";
import { Database, UserDatabase } from "../src/database/index.ts";
import { ErrorType, RegisterProps } from "../src/models.ts";

import "https://deno.land/x/dotenv/load.ts";

describe("Authentication", () => {
  let database: Database;
  let users: UserDatabase;
  let controller: AuthController;

  beforeAll(async () => {    
    const databaseUser = Deno.env.get("MONGO_ROOT_USER");
    const databasePassword = Deno.env.get("MONGO_ROOT_PASSWORD");    

    database = new Database(
      "saturn_testing",
      `mongodb://${databaseUser}:${databasePassword}@localhost:27017`,
    );
    await database.connect();

    users = new UserDatabase(database);
    controller = new AuthController(users);
  });

  afterAll(() => {
    database.close();
  });

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
});
