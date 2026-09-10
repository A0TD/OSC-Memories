import cloudinary from "../config/cloudinary.config";
import AppError from "./appError.util";
import fs from "fs/promises"

export const uploadOne = async(file:Express.Multer.File) => {
        if (!file) throw new AppError(400, "Missing file upload!");

    let result;
    try {
      result = await cloudinary.uploader.upload(file.path);
      const uploadedPublicId = result.public_id;
    } finally {
      if (file.path) {
        await fs.unlink(file.path).catch(() => {}); //Deletes the temporary files created by multer using File System (fs)
      }
    }

    return result
}

export const uploadMany = async (files:Express.Multer.File[]) => {
    const uploadedPublicIds = []
        if (!files || files.length === 0)
          throw new AppError(400, "Missing file upload!");
    
        let uploadedMedia;
        try {
          uploadedMedia = await Promise.all(
            files.map(async (file) => {
              const result = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                transformation: [
                  {
                    width: 1920,
                    height: 1080,
                    crop: "limit", // Downscale only if larger than 1080p, preserves aspect ratio
                    quality: "auto:good", // Smart compression (use "auto:eco" for maximum credit savings)
                    fetch_format: "auto", // Converts to WebP/AVIF automatically
                  },
                ],
              });
              uploadedPublicIds.push(result.public_id);
              return { file, result };
            }),
          );
        } finally {
          await Promise.all(
            //Deletes the temporary files created by multer using File System (fs)
            files.map((file) => fs.unlink(file.path).catch(() => {})),
          );
        }
}