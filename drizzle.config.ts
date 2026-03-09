import { defineConfig } from "drizzle-kit";

import { getMigrationDatabaseUrl } from "./lib/db/connection-string";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getMigrationDatabaseUrl() ?? ""
  }
});
