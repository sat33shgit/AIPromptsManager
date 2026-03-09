import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getRuntimeDatabaseUrl } from "@/lib/db/connection-string";

const connectionString = getRuntimeDatabaseUrl();

export const db =
  connectionString
    ? drizzle(postgres(connectionString, { prepare: false }))
    : null;
