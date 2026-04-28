import pool from "../config/database.js";

/**
 * Creates a content schedule entry.
 * @param {{contentId: number, slotId: number, rotationOrder?: number, duration?: number}} payload
 * @returns {Promise<object>}
 */
export async function createSchedule(payload) {
  const result = await pool.query(
    `
      INSERT INTO content_schedule (content_id, slot_id, rotation_order, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING id, content_id, slot_id, rotation_order, duration, created_at
    `,
    [
      payload.contentId,
      payload.slotId,
      payload.rotationOrder ?? 0,
      payload.duration ?? 5
    ]
  );
  return result.rows[0];
}

/**
 * Finds schedule items for a specific content ID with slot info.
 * @param {number} contentId
 * @returns {Promise<object[]>}
 */
export async function findScheduleByContent(contentId) {
  const result = await pool.query(
    `
      SELECT
        cs.id,
        cs.content_id,
        cs.slot_id,
        cs.rotation_order,
        cs.duration,
        cs.created_at,
        slot.subject
      FROM content_schedule cs
      JOIN content_slots slot ON slot.id = cs.slot_id
      WHERE cs.content_id = $1
      ORDER BY cs.rotation_order ASC, cs.id ASC
    `,
    [contentId]
  );
  return result.rows;
}

/**
 * Finds schedule items by slot with joined content info.
 * @param {number} slotId
 * @returns {Promise<object[]>}
 */
export async function findScheduleBySlot(slotId) {
  const result = await pool.query(
    `
      SELECT
        cs.id,
        cs.content_id,
        cs.slot_id,
        cs.rotation_order,
        cs.duration,
        cs.created_at,
        c.title,
        c.description,
        c.subject,
        c.file_url,
        c.file_type,
        c.file_size,
        c.start_time,
        c.end_time
      FROM content_schedule cs
      JOIN content c ON c.id = cs.content_id
      WHERE cs.slot_id = $1
      ORDER BY cs.rotation_order ASC, cs.id ASC
    `,
    [slotId]
  );
  return result.rows;
}

/**
 * Calculates the next rotation order for a slot.
 * @param {number} slotId
 * @returns {Promise<number>}
 */
export async function getNextRotationOrder(slotId) {
  const result = await pool.query(
    "SELECT COALESCE(MAX(rotation_order) + 1, 0) AS next_order FROM content_schedule WHERE slot_id = $1",
    [slotId]
  );
  return Number(result.rows[0]?.next_order ?? 0);
}

/**
 * Compatibility alias for existing service usage.
 * @param {{contentId: number, slotId: number, rotationOrder?: number, duration?: number}} payload
 * @returns {Promise<object>}
 */
export async function createContentSchedule(payload) {
  return createSchedule(payload);
}

/**
 * Compatibility helper retained for existing service usage.
 * @returns {Promise<object[]>}
 */
export async function listSchedulesByDate() {
  return [];
}