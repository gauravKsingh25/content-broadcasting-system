import pool from "../config/database.js";

/**
 * Creates a new user record.
 * @param {{name: string, email: string, passwordHash: string, role: string}} payload
 * @returns {Promise<object>}
 */
export async function createUser(payload) {
  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;
  const values = [payload.name, payload.email, payload.passwordHash, payload.role];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Finds a user by email.
 * @param {string} email
 * @returns {Promise<object|undefined>}
 */
export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return result.rows[0];
}

/**
 * Finds a user by ID.
 * @param {number} userId
 * @returns {Promise<object|undefined>}
 */
export async function findUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}