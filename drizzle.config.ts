import type { Config } from 'drizzle-kit';

export default {
  schema: './packages/db/src/schema.ts',
  out:    './packages/db/migrations',

  dialect: 'postgresql',

  // 👇  This single field is all push needs
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,   // or DATABASE_URL!
  },
} satisfies Config;
