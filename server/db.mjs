import { readFile } from "node:fs/promises";
import pg from "pg";

export async function openDatabase(env = process.env) {
  if (env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 });
    return {
      query: (sql, values) => pool.query(sql, values),
      close: () => pool.end(),
      async tx(fn) {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const result = await fn(client);
          await client.query("COMMIT");
          return result;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      },
    };
  }
  if (env.NODE_ENV === "production")
    throw new Error("DATABASE_URL is required in production");
  const { PGlite } = await import("@electric-sql/pglite");
  const local = new PGlite(env.LOCAL_DATABASE_PATH || "./.local-db");
  return {
    query: (sql, values) => local.query(sql, values),
    tx: (fn) => local.transaction(fn),
    close: () => local.close(),
  };
}
export async function migrate(db) {
  await db.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY)",
  );
  await db.tx(async (tx) => {
    if (
      (
        await tx.query(
          "SELECT version FROM schema_migrations WHERE version='001'",
        )
      ).rows.length
    )
      return;
    const sql = await readFile(
      new URL("./migrations/001_core.sql", import.meta.url),
      "utf8",
    );
    for (const statement of sql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean))
      await tx.query(statement);
    await tx.query("INSERT INTO schema_migrations VALUES ('001')");
  });
  await db.tx(async tx => {
    if ((await tx.query("SELECT version FROM schema_migrations WHERE version='002'")).rows.length) return;
    const sql = await readFile(new URL('./migrations/002_customers.sql', import.meta.url), 'utf8');
    for (const statement of sql.split(';').map(s=>s.trim()).filter(Boolean)) await tx.query(statement);
    await tx.query("INSERT INTO schema_migrations VALUES ('002')");
  });
}
