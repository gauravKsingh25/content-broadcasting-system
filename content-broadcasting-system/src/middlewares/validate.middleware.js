import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Runs validation chains and throws ApiError on failure.
 * @param {Array<import("express-validator").ValidationChain>} validations
 * @returns {import("express").RequestHandler}
 */
export function validate(validations) {
  return asyncHandler(async (req, _res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, "Validation failed", errors.array());
    }

    next();
  });
}

/**
 * Compatibility middleware for existing route style where validations are run separately.
 * @param {import("express").Request} req
 * @param {import("express").Response} _res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */
export const validateRequest = asyncHandler(async (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }
  next();
});