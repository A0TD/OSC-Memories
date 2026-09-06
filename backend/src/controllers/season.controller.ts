import { NextFunction, Request, Response } from "express";
import Season from "../models/season.model";
import Event from "../models/event.model";
import AppError from "../utils/appError.util";

export const getAllSeasons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seasons = await Season.find().sort({ date: -1 });
    return res.status(200).send({
      success: true,
      message: "Seasons retrieved successfully",
      data: {
        seasons,
      },
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
      data: {
        season,
      },
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
  try {
    const { name, date, description } = req.body;

    if (!name || !date || !description) {
      throw new AppError(400, "name, date, and description are required");
    }

    const season = await Season.create({ name, date, description });
    return res.status(201).send({
      success: true,
      message: "Season created successfully",
      data: {
        season,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateSeason = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { seasonId } = req.params;

    const season = await Season.findByIdAndUpdate(seasonId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!season) {
      throw new AppError(404, "Season not found");
    }

    return res.status(200).send({
      success: true,
      message: "Season updated successfully",
      data: {
        season,
      },
    });
  } catch (err) {
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

    return res.status(200).send({
      success: true,
      message: "Season and its events deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllSeasons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // delete all related events first
    await Event.deleteMany();
    const result = await Season.deleteMany();
    return res.status(200).send({
      success: true,
      message: "All seasons and their events deleted successfully",
      data: { result },
    });
  } catch (err) {
    next(err);
  }
};
