import { findApprovedContentByTeacher } from "../models/content.model.js";
import { findScheduleByContent } from "../models/contentSchedule.model.js";
import { getActiveContentByRotation } from "../utils/timeWindow.js";

/**
 * Fetches and merges schedule metadata for a single content item.
 * @param {object} item
 * @returns {Promise<object>}
 */
async function enrichContentWithSchedule(item) {
  const scheduleEntries = await findScheduleByContent(item.id);
  const schedule = scheduleEntries[0] || null;

  return {
    ...item,
    rotation_order: schedule?.rotation_order ?? 0,
    duration: schedule?.duration ?? 5
  };
}

/**
 * Returns currently active approved content for a teacher, optionally filtered by subject.
 * @param {number|string} teacherId
 * @param {string} [subject]
 * @returns {Promise<object|null>}
 */
export async function getLiveContent(teacherId, subject) {
  const approvedItems = await findApprovedContentByTeacher(Number(teacherId));

  const filteredItems = subject
    ? approvedItems.filter(
      (item) => String(item.subject).trim().toLowerCase() === String(subject).trim().toLowerCase()
    )
    : approvedItems;

  if (filteredItems.length === 0) {
    return null;
  }

  const enrichedItems = await Promise.all(filteredItems.map((item) => enrichContentWithSchedule(item)));
  const activeContent = getActiveContentByRotation(enrichedItems);
  return activeContent || null;
}