import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const getDrizzle = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
};

export const getDb = () => getDrizzle();

export type Db = ReturnType<typeof getDrizzle>;
