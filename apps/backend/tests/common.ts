import { Database } from "../src/database/index.ts";

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