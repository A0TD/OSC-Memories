import { Request, Response } from "express";
import Season  from "../models/season.model";
import Event from '../models/event.model'


export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await Season.find().sort({ date: -1 });
    return res.status(200).json(seasons);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch seasons", error });
  }
};

export const getSeasonById = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const season = await Season.findById(seasonId);

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    return res.status(200).json(season);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch season", error });
  }
};

export const createSeason = async (req: Request, res: Response) => {
  try {
    const { name, date, description } = req.body;

    if (!name || !date || !description) {
      return res
        .status(400)
        .json({ message: "name, date, and description are required" });
    }

    const season = await Season.create({ name, date, description });
    return res.status(201).json(season);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create season", error });
  }
};

export const updateSeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;

    const season = await Season.findByIdAndUpdate(seasonId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    return res.status(200).json(season);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update season", error });
  }
};

export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;

    // The pre("findOneAndDelete") hook on the Season schema
    // handles cascading deletion of related events
    const season = await Season.findOneAndDelete({ _id: seasonId });

    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    return res
      .status(200)
      .json({ message: "Season and its events deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete season", error });
  }
};



export const deleteAllSeasons = async (req: Request, res: Response) => {
  try {
    // delete all related events first
    await Event.deleteMany()
    const result = await Season.deleteMany();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete all seasons", error });
  }
};