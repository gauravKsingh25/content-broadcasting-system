import "dotenv/config";
import cors from "cors";
import express from "express";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { initDB } from "./config/database.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { mountRoutes } from "./routes/index.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" }
});

app.use("/content/live", publicLimiter);

app.get("/health", (req, res) => res.json({
  success: true,
  message: "Server is running",
  timestamp: new Date()
}));

mountRoutes(app);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  mkdirSync(process.env.UPLOAD_DIR || "uploads", { recursive: true });
  await initDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();

export default app;