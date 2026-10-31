
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pool from "./db.js";

const schemaPath = fileURLToPath(
  new URL("./schema.sql", import.meta.url)
);

try {
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
  console.log("Database tables created successfully!");
} catch (error) {
  console.error("Database setup failed:", error.message);
} finally {
  await pool.end();
}
