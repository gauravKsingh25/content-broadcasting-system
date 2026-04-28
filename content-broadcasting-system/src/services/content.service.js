import ApiError from "../utils/ApiError.js";
import { createContent, findContentByTeacher } from "../models/content.model.js";
import { findOrCreateSlot } from "../models/contentSlot.model.js";
import { createSchedule, getNextRotationOrder } from "../models/contentSchedule.model.js";

/**
 * Uploads content and creates a schedule entry in subject slot rotation.
 * @param {{title: string, description?: string, subject: string, file: Express.Multer.File|undefined, uploadedBy: number, startTime?: string, endTime?: string, rotationDuration?: number|string}} payload
 * @returns {Promise<object>}
 */
export async function uploadContent(payload) {
  const {
    title,
    description,
    subject,
    file,
    uploadedBy,
    startTime,
    endTime,
    rotationDuration
  } = payload;

  if (!file) {
    throw new ApiError(400, "File is required");
  }

  if (!title || !String(title).trim()) {
    throw new ApiError(400, "Title is required");
  }

  if (!subject || !String(subject).trim()) {
    throw new ApiError(400, "Subject is required");
  }

  if ((startTime && !endTime) || (!startTime && endTime)) {
    throw new ApiError(400, "startTime and endTime must both be provided together");
  }

  if (startTime && endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new ApiError(400, "startTime and endTime must be valid dates");
    }

    if (endDate <= startDate) {
      throw new ApiError(400, "endTime must be after startTime");
    }
  }

  const createdContent = await createContent({
    title: String(title).trim(),
    description: description || null,
    subject: String(subject).trim(),
    fileUrl: file.path,
    fileType: file.mimetype,
    fileSize: file.size,
    uploadedBy,
    startTime: startTime || null,
    endTime: endTime || null
  });

  const slot = await findOrCreateSlot(String(subject).trim());
  const nextRotationOrder = await getNextRotationOrder(slot.id);
  const parsedDuration = Number(rotationDuration);
  const duration = Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : 5;

  await createSchedule({
    contentId: createdContent.id,
    slotId: slot.id,
    rotationOrder: nextRotationOrder,
    duration
  });

  return createdContent;
}

/**
 * Fetches content uploaded by a specific teacher.
 * @param {number} teacherId
 * @returns {Promise<object[]>}
 */
export async function getMyContent(teacherId) {
  return findContentByTeacher(teacherId);
}