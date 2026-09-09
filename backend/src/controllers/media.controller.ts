import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import AppError from "../utils/appError.util";
import cloudinary from "../config/cloudinary.config";
import fs from "fs/promises";

// "fl_attachment" --> place after /upload/ in the image url to download.

export const getAllMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId, eventId } = req.params;
    const allMedia = await Media.find({ eventId }).populate(
      "eventId",
      "seasonId",
    );
    // filters by correct seasonId
    const correctMedia = allMedia.filter((media) => {
      return (media.eventId as any).seasonId.toString() === seasonId;
    });

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved all media!",
      correctMedia,
    });
  } catch (err) {
    next(err);
  }
};

export const getMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId, eventId, mediaId } = req.params;

    const foundMedia = await Media.findOne({ _id: mediaId, eventId }).populate(
      "eventId",
      "seasonid",
    );

    if (
      !foundMedia ||
      (foundMedia.eventId as any).seasonId.toString() !== seasonId
    )
      throw new AppError(404, "Media not found!");

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved media!",
      foundMedia,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadMedia = async (
  //takes uploaded files from the request and uploads them one by one to cloudinary
  //deletes the temporary files from the server's local storage
  //creates documents for all the uploaded media then inserts them all into the database
  //if it fails even one file upload, it deletes the rest from cloudinary to enforce atomicity
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uploadedPublicIds: string[] = [];
  try {
    const { eventId }: any = req.params;
    const files = req.files as Express.Multer.File[]; // allows using .map() on the files variable

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

    const mediaDocuments = uploadedMedia.map(({ file, result }) => {
      //destructures a single uploaded media into file and result
      return {
        ownerId: (req as any).user.id,
        eventId,
        url: result.secure_url,
        mimeType: file.mimetype,
        publicId: result.public_id,
      };
    });

    const createdMedia = await Media.insertMany(mediaDocuments);

    res.status(200).json({
      success: true,
      message: "Upload successful",
      createdMedia,
    });
  } catch (err) {
    if (uploadedPublicIds.length > 0) {
      await Promise.all(
        uploadedPublicIds.map(async (uploadedPublicId) => {
          await cloudinary.uploader.destroy(uploadedPublicId).catch(() => {});
        }),
      );
    }
    next(err);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId, eventId, mediaId } = req.params;
    const deletedMedia = await Media.findOne({
      _id: mediaId,
      eventId,
    }).populate("eventId", "seasonId");

    if (
      !deletedMedia ||
      (deletedMedia.eventId as any).seasonId.toString() !== seasonId
    )
      throw new AppError(404, "Media not found!");

    await Media.findOneAndDelete({ _id: mediaId });

    return res.status(200).send({
      success: true,
      message: "Media deleted successfully!",
    });
  } catch (err) {
    next(err);
  }
};

export const getMediaByOwnerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const foundMedia = await Media.find({ ownerId: userId });

    if (!foundMedia) throw new AppError(404, "Media not found!");

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved media!",
      foundMedia,
    });
  } catch (err) {
    next(err);
  }
};
