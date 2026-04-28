import ApiError from "../utils/ApiError.js";

/**
 * Handles unmatched routes.
 * @param {import("express").Request} req
 * @param {import("express").Response} _res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function notFoundMiddleware(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

/**
 * Centralized error response formatter.
 * @param {Error & {statusCode?: number, code?: string, errors?: Array<unknown>, isOperational?: boolean, name?: string}} err
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 * @returns {void}
 */
export function errorHandler(err, _req, res, _next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({
      success: false,
      message: "File size exceeds the 10MB limit"
    });
    return;
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    res.status(400).json({
      success: false,
      message: "Unexpected file field"
    });
    return;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
    return;
  }

  if (err.code === "23505") {
    res.status(409).json({
      success: false,
      message: "Duplicate resource already exists"
    });
    return;
  }

  if (err.code === "23503") {
    res.status(400).json({
      success: false,
      message: "Related resource does not exist"
    });
    return;
  }

  if (err.isOperational === true) {
    const statusCode = err.statusCode || 400;
    const response = {
      success: false,
      message: err.message
    };

    if (Array.isArray(err.errors) && err.errors.length > 0) {
      response.errors = err.errors;
    }

    res.status(statusCode).json(response);
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

export const errorMiddleware = errorHandler;