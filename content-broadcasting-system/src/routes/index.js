import approvalRouter from "./approval.routes.js";
import authRouter from "./auth.routes.js";
import contentRouter from "./content.routes.js";
import publicRouter from "./public.routes.js";

/**
 * Mounts all route groups on the provided Express app.
 * @param {import("express").Express} app
 * @returns {void}
 */
export function mountRoutes(app) {
	app.use("/api/auth", authRouter);
	app.use("/api/content", contentRouter);
	app.use("/api/approval", approvalRouter);
	app.use("/", publicRouter);
}