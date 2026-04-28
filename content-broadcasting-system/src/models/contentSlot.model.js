import pool from "../config/database.js";

/**
 * Finds a slot by subject or creates a new slot if missing.
 * @param {string} subject
 * @returns {Promise<object>}
 */
export async function findOrCreateSlot(subject) {
  const existing = await pool.query(
    "SELECT id, subject, created_at FROM content_slots WHERE subject = $1 LIMIT 1",
    [subject]
  );

  if (existing.rows[0]) {
    return existing.rows[0];
  }

  const created = await pool.query(
    `
      INSERT INTO content_slots (subject)
      VALUES ($1)
      RETURNING id, subject, created_at
    `,
    [subject]
  );
  return created.rows[0];
}

/**
 * Compatibility helper to list available slots.
 * @returns {Promise<object[]>}
 */
export async function listContentSlots() {
  const result = await pool.query(
    "SELECT id, subject, created_at FROM content_slots ORDER BY subject ASC"
  );
  return result.rows;
}