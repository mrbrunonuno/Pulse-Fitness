
import pool from "./db.js";

try {
  const result = await pool.query(
    "SELECT NOW() AS database_time, current_database() AS database_name"
  );

  console.log("Database connected successfully!");
  console.log("Database:", result.rows[0].database_name);
  console.log("Connection test passed.");
} catch (error) {
  console.error("Database connection failed:", error.message);
} finally {
  await pool.end();
}
