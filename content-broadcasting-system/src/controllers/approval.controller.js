import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  approveContent as approveContentService,
  rejectContent as rejectContentService
} from "../services/approval.service.js";

/**
 * Approves pending content.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const approveContent = asyncHandler(async (req, res) => {
  const contentId = Number(req.params.id);
  const result = await approveContentService(contentId, req.user.id);
  res.status(200).json(new ApiResponse(200, result, "Content approved successfully"));
});

/**
 * Rejects pending content.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const rejectContent = asyncHandler(async (req, res) => {
  const contentId = Number(req.params.id);
  const { rejectionReason } = req.body;
  const result = await rejectContentService(contentId, req.user.id, rejectionReason);
  res.status(200).json(new ApiResponse(200, result, "Content rejected"));
});

export const approveContentController = approveContent;
export const rejectContentController = rejectContent;