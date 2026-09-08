import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import AppError from "../utils/appError.util";
import cloudinary from "../config/cloudinary.config";
import fs from "fs/promises";

export const getAllMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allMedia = await Media.find();

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved all media!",
      allMedia,
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

export const uploadMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let uploadedPublicId;
  try {
    const { eventId }: any = req.params;
    if (!req.file) throw new AppError(400, "Missing file upload!");

    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path);
      uploadedPublicId = result.public_id;
    } finally {
      if (req.file.path) {
        await fs.unlink(req.file.path).catch(() => {}); //Deletes the temporary files created by multer using File System (fs)
      }
    }

    const createdMedia = await Media.create({
      ownerId: (req as any).user.id,
      eventId,
      url: result.secure_url,
      mimeType: req.file.mimetype,
      publicId: result.public_id,
    });

    res.status(200).json({
      success: true,
      message: "Upload successful",
      createdMedia,
    });
  } catch (err) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => {});
    }
    next(err);
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  res.status(500).send({
    success: false,
    message: "Not implemented",
  });
};

export const deleteMedia = async (req: Request, res: Response) => {
  res.status(500).send({
    success: false,
    message: "Not implemented",
  });
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
