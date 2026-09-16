import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.memoryStorage()

// 1. Define the file filter function
const fileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  const mimeType = allowedMimeTypes.includes(file.mimetype);

  if (mimeType) {
    callback(null, true); // Accept file
  } else {
    callback(
      new Error(
        "Invalid file format. Only JPEG, PNG, and WEBP files are allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}); // 20 for 20MB

export default upload;
