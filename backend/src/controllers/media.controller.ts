import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import AppError from "../utils/appError.util";
import cloudinary from "../config/cloudinary.config";
import { uploadMany } from "../utils/uploadMedia.util";

// "fl_attachment" --> place after /upload/ in the image url to download.

export const getAllMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventId } = req.params;
    const allMedia = await Media.find({ eventId });

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved all media!",
      media: allMedia,
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
    const { eventId, mediaId } = req.params;

    const foundMedia = await Media.findOne({ _id: mediaId, eventId });
    if (!foundMedia) {
      throw new AppError(404, "Media not found!");
    }

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved media!",
      media: foundMedia,
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
  let uploadedMedia: Awaited<ReturnType<typeof uploadMany>> = [];
  try {
    const { eventId }: any = req.params;
    const files = req.files as Express.Multer.File[]; // allows using .map() on the files variable

    if (!files || files.length === 0)
      throw new AppError(400, "Missing file upload!");

    uploadedMedia = await uploadMany(files);

    const mediaDocuments = uploadedMedia.map(({ file, result }) => {
      const autoDownloadUrl = cloudinary.url(result.public_id, {
        secure: true,
        format: result.format, // Keeps the original uploaded format
        flags: "attachment", // Triggers the download prompt in the browser
      });
      //destructures a single uploaded media into file and result
      return {
        ownerId: (req as any).user.id,
        eventId,
        url: result.secure_url,
        downloadUrl: autoDownloadUrl,
        mimeType: file.mimetype,
        publicId: result.public_id,
      };
    });

    const createdMedia = await Media.insertMany(mediaDocuments);

    res.status(200).json({
      success: true,
      message: "Upload successful",
      media: createdMedia,
    });
  } catch (err) {
    if (uploadedMedia.length > 0) {
      await Promise.all(
        uploadedMedia.map(({ result }) => {
          cloudinary.uploader.destroy(result.public_id).catch(() => {});
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
    const { eventId, mediaId } = req.params;
    const deletedMedia = await Media.findOne({
      _id: mediaId,
      eventId,
    });

    if (!deletedMedia) {
      throw new AppError(404, "Media not found!");
    }

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
      media: foundMedia,
    });
  } catch (err) {
    next(err);
  }
};
