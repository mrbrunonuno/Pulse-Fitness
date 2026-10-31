
import pool from "./db.js";

try {
  await pool.query(`
    ALTER TABLE fitness_classes
      ADD COLUMN IF NOT EXISTS title VARCHAR(150),
      ADD COLUMN IF NOT EXISTS category VARCHAR(50),
      ADD COLUMN IF NOT EXISTS intensity VARCHAR(20),
      ADD COLUMN IF NOT EXISTS duration VARCHAR(30),
      ADD COLUMN IF NOT EXISTS trainer VARCHAR(100),
      ADD COLUMN IF NOT EXISTS spots_left INTEGER,
      ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1),
      ADD COLUMN IF NOT EXISTS description TEXT;
  `);

  console.log("Fitness classes table updated successfully!");
} catch (error) {
  console.error("Schema update failed:", error.message);
} finally {
  await pool.end();
}
