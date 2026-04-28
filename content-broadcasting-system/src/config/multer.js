import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import multer from "multer";
import ApiError from "../utils/ApiError.js";

dotenv.config();

const uploadDirectory = process.env.UPLOAD_DIR || "uploads";
const maxFileSizeBytes = parseInt(process.env.MAX_FILE_SIZE_MB || 10, 10) * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new ApiError(400, "Only JPG, PNG, and GIF files are allowed"), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: maxFileSizeBytes
  }
});

export const uploadSingle = upload.single("file");

export default upload;