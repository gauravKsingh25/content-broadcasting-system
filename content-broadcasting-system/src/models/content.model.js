import pool from "../config/database.js";

/**
 * Creates a content record.
 * @param {{title: string, description: string, subject: string, fileUrl: string, fileType: string, fileSize: number, uploadedBy: number, startTime?: Date|string|null, endTime?: Date|string|null}} payload
 * @returns {Promise<object>}
 */
export async function createContent(payload) {
  const query = `
    INSERT INTO content (
      title,
      description,
      subject,
      file_url,
      file_type,
      file_size,
      uploaded_by,
      start_time,
      end_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    payload.title,
    payload.description,
    payload.subject,
    payload.fileUrl,
    payload.fileType,
    payload.fileSize,
    payload.uploadedBy,
    payload.startTime || null,
    payload.endTime || null
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Fetches all content rows with uploader name.
 * @returns {Promise<object[]>}
 */
export async function findAllContent() {
  const result = await pool.query(
    `
      SELECT c.*, uploader.name AS uploader_name
      FROM content c
      JOIN users uploader ON uploader.id = c.uploaded_by
      ORDER BY c.created_at DESC
    `
  );
  return result.rows;
}

/**
 * Fetches pending content rows with uploader name.
 * @returns {Promise<object[]>}
 */
export async function findPendingContent() {
  const result = await pool.query(
    `
      SELECT c.*, uploader.name AS uploader_name
      FROM content c
      JOIN users uploader ON uploader.id = c.uploaded_by
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC
    `
  );
  return result.rows;
}

/**
 * Fetches content by teacher.
 * @param {number} teacherId
 * @returns {Promise<object[]>}
 */
export async function findContentByTeacher(teacherId) {
  const result = await pool.query(
    `
      SELECT c.*, uploader.name AS uploader_name
      FROM content c
      JOIN users uploader ON uploader.id = c.uploaded_by
      WHERE c.uploaded_by = $1
      ORDER BY c.created_at DESC
    `,
    [teacherId]
  );
  return result.rows;
}

/**
 * Finds content by ID with uploader and approver names.
 * @param {number} id
 * @returns {Promise<object|undefined>}
 */
export async function findContentById(id) {
  const result = await pool.query(
    `
      SELECT
        c.*,
        uploader.name AS uploader_name,
        approver.name AS approver_name
      FROM content c
      JOIN users uploader ON uploader.id = c.uploaded_by
      LEFT JOIN users approver ON approver.id = c.approved_by
      WHERE c.id = $1
      LIMIT 1
    `,
    [id]
  );
  return result.rows[0];
}

/**
 * Updates content moderation status.
 * @param {number} id
 * @param {{status: string, rejectionReason?: string|null, approvedBy?: number|null, approvedAt?: Date|string|null}} payload
 * @returns {Promise<object|undefined>}
 */
export async function updateContentStatus(id, payload) {
  const result = await pool.query(
    `
      UPDATE content
      SET
        status = $1,
        rejection_reason = $2,
        approved_by = $3,
        approved_at = $4
      WHERE id = $5
      RETURNING *
    `,
    [
      payload.status,
      payload.rejectionReason || null,
      payload.approvedBy || null,
      payload.approvedAt || null,
      id
    ]
  );
  return result.rows[0];
}

/**
 * Finds approved, time-bounded content by teacher.
 * @param {number} teacherId
 * @returns {Promise<object[]>}
 */
export async function findApprovedContentByTeacher(teacherId) {
  const result = await pool.query(
    `
      SELECT c.*, uploader.name AS uploader_name
      FROM content c
      JOIN users uploader ON uploader.id = c.uploaded_by
      WHERE c.uploaded_by = $1
        AND c.status = 'approved'
        AND c.start_time IS NOT NULL
        AND c.end_time IS NOT NULL
      ORDER BY c.created_at DESC
    `,
    [teacherId]
  );
  return result.rows;
}

/**
 * Compatibility alias for existing service usage.
 * @returns {Promise<object[]>}
 */
export async function listContents() {
  return findAllContent();
}

/**
 * Compatibility alias for existing service usage.
 * @param {number} contentId
 * @returns {Promise<object|undefined>}
 */
export async function getContentById(contentId) {
  return findContentById(contentId);
}

/**
 * Compatibility alias for existing service usage.
 * @param {number} contentId
 * @param {string} status
 * @param {number} approverId
 * @returns {Promise<object|undefined>}
 */
export async function updateContentApprovalStatus(contentId, status, approverId) {
  return updateContentStatus(contentId, {
    status,
    rejectionReason: status === "rejected" ? "Rejected by approver" : null,
    approvedBy: approverId,
    approvedAt: new Date()
  });
}