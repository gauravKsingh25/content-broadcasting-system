import { Router } from "express";
import { body } from "express-validator";
import { approveContent, rejectContent } from "../controllers/approval.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

const rejectValidation = [
  body("rejectionReason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting content")
];

router.patch(
  "/:id/approve",
  verifyToken,
  authorizeRoles("principal"),
  approveContent
);

router.patch(
  "/:id/reject",
  verifyToken,
  authorizeRoles("principal"),
  validate(rejectValidation),
  rejectContent
);

export default router;