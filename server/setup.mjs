import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { openDatabase, migrate } from "./db.mjs";
import { passwordHash } from "./auth.mjs";
import { defaults, productSchema } from "./validation.mjs";
export async function initialize(db, { seed = false } = {}) {
  await migrate(db);
  await db.tx(async (tx) => {
    const inserted = await tx.query(
      "INSERT INTO settings(id,data) VALUES(1,$1) ON CONFLICT(id) DO NOTHING RETURNING id",
      [JSON.stringify(defaults)],
    );
    if (inserted.rows.length)
      for (let n = 1; n <= defaults.totalTables; n++)
        await tx.query(
          "INSERT INTO restaurant_tables(id,table_number,capacity) VALUES($1,$2,$3) ON CONFLICT(table_number) DO NOTHING",
          [randomUUID(), n, defaults.tableCapacity],
        );
    if (seed) {
      const products = JSON.parse(
        await readFile(
          new URL("./seed-products.json", import.meta.url),
          "utf8",
        ),
      );
      for (const product of products) {
        const { id, ...data } = product;
        await tx.query(
          "INSERT INTO products(id,data) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
          [id, JSON.stringify(productSchema.parse(data))],
        );
      }
    }
  });
}
if (process.argv[1]?.endsWith("/setup.mjs")) {
  const db = await openDatabase();
  try {
    await initialize(db, { seed: process.argv.includes("--seed") });
    const bootstrap = process.argv.includes('--bootstrap-admin');
    const needsAdmin = bootstrap && !(await db.query('SELECT id FROM admins LIMIT 1')).rows.length;
    if (process.argv.includes("--admin") || needsAdmin) {
      const email = process.env.ADMIN_EMAIL?.toLowerCase();
      const password = process.env.ADMIN_PASSWORD;
      if (
        !email ||
        !/^[^@]+@[^@]+\.[^@]+$/.test(email) ||
        !password ||
        password.length < 12
      )
        throw new Error(
          "ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) required",
        );
      await db.query(
        bootstrap ? "INSERT INTO admins(id,email,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING" : "INSERT INTO admins(id,email,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO UPDATE SET password_hash=$3",
        [randomUUID(), email, await passwordHash(password)],
      );
      await db.query(
        "DELETE FROM sessions WHERE admin_id=(SELECT id FROM admins WHERE email=$1)",
        [email],
      );
    }
    console.log(
      "Database initialized. Restaurant stays closed until configured.",
    );
  } finally {
    await db.close();
  }
}
