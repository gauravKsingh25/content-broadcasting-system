import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Authorizes request based on allowed role list.
 * @param {...string} roles
 * @returns {import("express").RequestHandler}
 */
export function authorizeRoles(...roles) {
  return asyncHandler(async (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }

    next();
  });
}