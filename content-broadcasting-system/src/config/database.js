import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

/**
 * Creates all required database tables if they do not already exist.
 * @returns {Promise<void>}
 */
export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('principal', 'teacher')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size BIGINT NOT NULL,
        uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
        rejection_reason TEXT,
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_slots (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_schedule (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
        slot_id INTEGER NOT NULL REFERENCES content_slots(id),
        rotation_order INTEGER NOT NULL DEFAULT 0,
        duration INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // eslint-disable-next-line no-console
    console.log("Database initialized successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize database:", error);
    // If objects already exist (e.g., sequence/table created in a prior run),
    // log a warning and continue instead of crashing the process. This
    // avoids hard failures when the DB was already partially initialized.
    // Postgres unique constraint on pg_class shows up as code '23505'.
    if (error && error.code === '23505') {
      // eslint-disable-next-line no-console
      console.warn('Database objects already exist; continuing startup.');
      return;
    }
    process.exit(1);
  }
}

export default pool;

initDB();