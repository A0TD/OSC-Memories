import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  filename: (req: Request, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 for 10MB

export default upload;
