const runtimeConnectionCandidates = process.env.VERCEL
  ? [
      process.env.POSTGRES_URL,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.POSTGRES_PRISMA_URL,
      process.env.DATABASE_URL
    ]
  : [
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.POSTGRES_PRISMA_URL
    ];

const migrationConnectionCandidates = process.env.VERCEL
  ? [
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL,
      process.env.DATABASE_URL
    ]
  : [
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL
    ];

function pickConnectionString(candidates: Array<string | undefined>) {
  return candidates.find((value) => typeof value === "string" && value.trim().length > 0) ?? null;
}

export function getRuntimeDatabaseUrl() {
  return pickConnectionString(runtimeConnectionCandidates);
}

export function getMigrationDatabaseUrl() {
  return pickConnectionString(migrationConnectionCandidates);
}
