import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Verifies bearer token and attaches decoded payload to request.
 * @param {import("express").Request} req
 * @param {import("express").Response} _res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */
export const verifyToken = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  next();
});

export const authenticateToken = verifyToken;