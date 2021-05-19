import { assertThrowsAsync, describe, GQLError, it } from "./test.deps.ts";
import { testWithClient } from "./common.ts";

import { registerUser } from "../src/controller/auth.controller.ts";
import { ErrorType } from "../src/models.ts";

describe("Authentication", () => {
  it("should fail because request is incorrect", async () => {
    await assertThrowsAsync(
      async () =>
        await registerUser(
          undefined,
          {
            props: {
              email: "",
              name: "",
              password: "",
            },
          },
          undefined,
          undefined,
        ),
      GQLError,
      ErrorType.INCORRECT_REQUEST,
    );
  });

  it("should fail because the given password is not valid", async () => {
    await assertThrowsAsync(
      async () =>
        await registerUser(
          undefined,
          {
            props: {
              email: "test@test.de",
              name: "Max Mustermann",
              password: "testPassword",
            },
          },
          undefined,
          undefined,
        ),
      GQLError,
      ErrorType.INVALID_PASSWORD_FORMAT,
    );
  });

  it("should fail because the given email is not valid", async () => {
    await assertThrowsAsync(
      async () =>
        await registerUser(
          undefined,
          {
            props: {
              email: "test@test",
              name: "Max Mustermann",
              password: "SuperSicheresPasswort#1337#%",
            },
          },
          undefined,
          undefined,
        ),
      GQLError,
      ErrorType.INVALID_EMAIL_FORMAT,
    );
  });
});
