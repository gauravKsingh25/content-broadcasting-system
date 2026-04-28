import { Router } from "express";
import { body } from "express-validator";
import {
  getAllContent,
  getMyContent,
  getPendingContent,
  uploadContent
} from "../controllers/content.controller.js";
import { uploadSingle } from "../config/multer.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

const uploadValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("startTime").optional().isISO8601().withMessage("startTime must be a valid date"),
  body("endTime").optional().isISO8601().withMessage("endTime must be a valid date"),
  body("rotationDuration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("rotationDuration must be a positive integer (minutes)")
];

router.post(
  "/upload",
  verifyToken,
  authorizeRoles("teacher"),
  uploadSingle,
  validate(uploadValidation),
  uploadContent
);

router.get("/my", verifyToken, authorizeRoles("teacher"), getMyContent);

router.get("/all", verifyToken, authorizeRoles("principal"), getAllContent);

router.get("/pending", verifyToken, authorizeRoles("principal"), getPendingContent);

export default router;