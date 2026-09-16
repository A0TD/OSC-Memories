import cloudinary from "../config/cloudinary.config";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { compressImage } from "./compressMedia.util";
import { Readable } from "stream";

const defaultUploadOptions: UploadApiOptions = {
  resource_type: "auto",
};

const streamUpload = (
  buffer: Buffer,
  options: UploadApiOptions,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    uploadStream.on("error", (error) => reject(error));

    const readableStream = Readable.from(buffer);
    readableStream.on("error", (error) => reject(error));

    readableStream.pipe(uploadStream);
  });
};

export const uploadOne = async (
  file: Express.Multer.File,
  options: UploadApiOptions = defaultUploadOptions,
) => {
  const isImage = file.mimetype.startsWith("image/");

  const bufferToUpload = isImage
    ? await compressImage(file.buffer)
    : file.buffer;

  const result = await streamUpload(bufferToUpload, options);

  return { file, result };
};

export const uploadMany = async (
  files: Express.Multer.File[],
  options: UploadApiOptions = defaultUploadOptions,
) => {
  const uploadedPublicIds: string[] = [];
  try {
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const isImage = file.mimetype.startsWith("image/");
        
        const bufferToUpload = isImage
          ? await compressImage(file.buffer)
          : file.buffer;

        const result = await streamUpload(bufferToUpload, options);

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
  }
};
