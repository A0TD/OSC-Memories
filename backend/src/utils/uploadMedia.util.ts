import cloudinary from "../config/cloudinary.config";
import { UploadApiOptions } from "cloudinary";
import fs from "fs/promises";

const defaultUploadOptions: UploadApiOptions = {
  resource_type: "auto",
  transformation: [
    {
      width: 1920,
      height: 1080,
      crop: "limit",
      quality: "auto:good",
      fetch_format: "auto",
    },
  ],
};

export const uploadOne = async (
  file: Express.Multer.File,
  options: UploadApiOptions = defaultUploadOptions,
) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, options);

    return { file, result };
  } finally {
    if (file.path) {
      await fs.unlink(file.path).catch(() => {}); //Deletes the temporary files created by multer using File System (fs)
    }
  }
};

export const uploadMany = async (
  files: Express.Multer.File[],
  options: UploadApiOptions = defaultUploadOptions,
) => {
  const uploadedPublicIds: string[] = [];
  try {
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, options);

        uploadedPublicIds.push(result.public_id);

        return { file, result };
      }),
    );

    return uploadedMedia;
  } catch (err) {
    if (uploadedPublicIds.length > 0) {
      await cloudinary.api.delete_resources(uploadedPublicIds).catch(() => {});
    }

    throw err;
  } finally {
    await Promise.all(
      //Deletes the temporary files created by multer using File System (fs)
      files.map((file) => fs.unlink(file.path).catch(() => {})),
    );
  }
};
