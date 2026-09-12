import { NextFunction, Request, Response } from "express";
import Season from "../models/season.model";
import AppError from "../utils/appError.util";
import { uploadOne } from "../utils/uploadMedia.util";
import cloudinary from "../config/cloudinary.config";

export const getAllSeasons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seasons = await Season.find().sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Seasons retrieved successfully",
      seasons,
    });
  } catch (err) {
    next(err);
  }
};

export const getSeasonById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId } = req.params;
    const season = await Season.findById(seasonId);

    if (!season) {
      throw new AppError(404, "Season not found");
    }

    return res.status(200).send({
      success: true,
      message: "Season retrieved successfully",
      season,
    });
  } catch (err) {
    next(err);
  }
};

export const createSeason = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, date, description } = req.body;
  const file = req.file as Express.Multer.File;
  let uploadedImage;
  try {
    if (file) {
      uploadedImage = await uploadOne(file);
    }

    const season = await Season.create({
      name,
      date,
      imageUrl: uploadedImage?.result.url,
      imagePublicId: uploadedImage?.result.public_id,
      description,
    });
    return res.status(201).send({
      success: true,
      message: "Season created successfully",
      season,
    });
  } catch (err) {
    if (uploadedImage) {
      await cloudinary.uploader
        .destroy(uploadedImage.result.public_id)
        .catch(() => {});
    }
    next(err);
  }
};

export const updateSeason = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, date, description } = req.body;
  const { seasonId } = req.params;
  const file = req.file;
  let uploadedImage;
  try {
    const season = await Season.findById(seasonId);

    if (!season) {
      throw new AppError(404, "Season not found");
    }

    if (file) {
      uploadedImage = await uploadOne(file);
    }

    const updatedSeason = await Season.findByIdAndUpdate(
      seasonId,
      {
        name,
        date,
        imageUrl: uploadedImage?.result.url,
        imagePublicId: uploadedImage?.result.public_id,
        description,
      },
      { new: true, runValidators: true },
    );

    if (file && season.imagePublicId) {
      await cloudinary.uploader.destroy(season.imagePublicId).catch(() => {});
    }

    return res.status(200).send({
      success: true,
      message: "Season updated successfully",
      season: updatedSeason,
    });
  } catch (err) {
    if (uploadedImage) {
      await cloudinary.uploader
        .destroy(uploadedImage.result.public_id)
        .catch(() => {});
    }
    next(err);
  }
};

export const deleteSeason = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId } = req.params;

    // The pre("findOneAndDelete") hook on the Season schema
    // handles cascading deletion of related events
    const season = await Season.findOneAndDelete({ _id: seasonId });

    if (!season) {
      throw new AppError(404, "Season not found");
    }

    if (season.imagePublicId)
      await cloudinary.uploader.destroy(season.imagePublicId).catch(() => {});

    return res.status(200).send({
      success: true,
      message: "Season and its events deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
