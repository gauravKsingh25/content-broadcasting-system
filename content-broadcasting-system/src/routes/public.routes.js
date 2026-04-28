import { Router } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import { getLiveContent } from "../controllers/content.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const publicRouter = Router();

/**
 * Reports service health status.
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */
async function healthController(_req, res, next) {
  try {
    res.status(200).json(new ApiResponse(200, { status: "ok" }, "Service is healthy"));
  } catch (error) {
    next(error);
  }
}

publicRouter.get("/health", validateRequest, healthController);
publicRouter.get("/content/live/:teacherId", getLiveContent);

export default publicRouter;