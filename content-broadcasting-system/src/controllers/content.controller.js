import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { uploadSingle } from "../config/multer.js";
import * as schedulingService from "../services/scheduling.service.js";
import {
  getMyContent as getMyContentService,
  uploadContent as uploadContentService
} from "../services/content.service.js";
import { findAllContent, findPendingContent } from "../models/content.model.js";

/**
 * Uploads new content for teacher and schedules it in subject rotation.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const uploadContent = asyncHandler(async (req, res) => {
  const { title, description, subject, startTime, endTime, rotationDuration } = req.body;

  if (!req.user?.id) {
    throw new ApiError(401, "Invalid or expired token");
  }

  if (typeof uploadSingle !== "function") {
    throw new ApiError(500, "Upload middleware is not configured");
  }

  const content = await uploadContentService({
    title,
    description,
    subject,
    file: req.file,
    uploadedBy: req.user.id,
    startTime,
    endTime,
    rotationDuration
  });

  res.status(201).json(new ApiResponse(201, content, "Content uploaded successfully"));
});

/**
 * Returns content uploaded by the authenticated teacher.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getMyContent = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const items = await getMyContentService(req.user.id);
  res.status(200).json(new ApiResponse(200, items, "My content fetched successfully"));
});

/**
 * Returns all content for principal users.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getAllContent = asyncHandler(async (_req, res) => {
  const items = await findAllContent();
  res.status(200).json(new ApiResponse(200, items, "All content fetched successfully"));
});

/**
 * Returns pending content for principal review.
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getPendingContent = asyncHandler(async (_req, res) => {
  const items = await findPendingContent();
  res.status(200).json(new ApiResponse(200, items, "Pending content fetched successfully"));
});

/**
 * Returns currently live content for a teacher, optionally filtered by subject.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getLiveContent = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const { subject } = req.query;

  const activeContent = await schedulingService.getLiveContent(teacherId, subject);

  if (!activeContent) {
    return res.status(200).json(
      new ApiResponse(200, null, "No content available")
    );
  }

  const publicContent = {
    id: activeContent.id,
    title: activeContent.title,
    description: activeContent.description,
    subject: activeContent.subject,
    fileUrl: activeContent.file_url,
    fileType: activeContent.file_type
  };

  return res.status(200).json(
    new ApiResponse(200, publicContent, "Content fetched successfully")
  );
});

export const createContentController = uploadContent;
export const listContentController = getAllContent;