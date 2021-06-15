import { assertThrowsAsync, GQLError, it, v4 } from "./test.deps.ts";
import { BingoField, CreateGame, ErrorType, User } from "../src/models.ts";
import { Database } from "../src/database/index.ts";

export const defaultUser: User = {
  _id: "60c336ddc68379bceaf6b3c5",
  email: "test@test.de",
  name: "Max Mustermann",
  password: "",
};

export const getDatabase = async (options?: {
  name?: string;
  url?: string;
  user?: string;
  password?: string;
}) => {
  const databaseUser = options?.user ?? Deno.env.get("MONGO_ROOT_USER");
  const databasePassword = options?.password ??
    Deno.env.get("MONGO_ROOT_PASSWORD");

  const database = new Database(
    options?.name ?? "saturn_testing",
    options?.url ??
      `mongodb://${databaseUser}:${databasePassword}@localhost:27017`,
  );

  await database.connect();
  return database;
};

export const defaultInvalidRequestTest = <T>(
  name: string,
  fn: () => Promise<T>,
) => {
  return it(name, async () => {
    await assertThrowsAsync(
      async () => await fn(),
      GQLError,
      ErrorType.INCORRECT_REQUEST,
    );
  });
};

export const generateBingoFields = (length?: number) => {
  return Array.from({ length: length ?? 40 }).map<BingoField>((_, index) => ({
    _id: v4.generate(),
    text: `Field ${index}`,
    checked: false,
  }));
};
