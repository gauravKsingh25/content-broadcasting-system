import ApiError from "../utils/ApiError.js";
import { findContentById, updateContentStatus } from "../models/content.model.js";

/**
 * Approves a content item.
 * @param {number} contentId
 * @param {number} principalId
 * @returns {Promise<object>}
 */
export async function approveContent(contentId, principalId) {
  const content = await findContentById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  if (content.status !== "pending") {
    throw new ApiError(400, `Content is already ${content.status}`);
  }

  const updated = await updateContentStatus(contentId, {
    status: "approved",
    approvedBy: principalId,
    approvedAt: new Date().toISOString(),
    rejectionReason: null
  });

  return updated;
}

/**
 * Rejects a content item.
 * @param {number} contentId
 * @param {number} principalId
 * @param {string} rejectionReason
 * @returns {Promise<object>}
 */
export async function rejectContent(contentId, principalId, rejectionReason) {
  if (!rejectionReason || !String(rejectionReason).trim()) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const content = await findContentById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  if (content.status !== "pending") {
    throw new ApiError(400, `Content is already ${content.status}`);
  }

  const updated = await updateContentStatus(contentId, {
    status: "rejected",
    rejectionReason: String(rejectionReason).trim(),
    approvedBy: null,
    approvedAt: null
  });

  return updated;
}