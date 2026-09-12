import { Request, Response, NextFunction } from "express";
import EventInfo from "../models/eventInfo.model";
import AppError from "../utils/appError.util";

export const getAllEventInfos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const eventInfos = await EventInfo.find();
    return res.status(200).send({
      success: true,
      message: "Event infos retrieved successfully",
      eventInfos,
    });
  } catch (err) {
    next(err);
  }
};

export const getEventInfoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventInfoId } = req.params;

    const eventInfo = await EventInfo.findById(eventInfoId);

    if (!eventInfo) {
      throw new AppError(404, "Event info not found");
    }
    return res.status(200).send({
      success: true,
      message: "Event info retrieved successfully",
      eventInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const createEventInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    const eventInfo = await EventInfo.create({
      name,
      description,
    });
    return res.status(201).send({
      success: true,
      message: "Event info created successfully",
      eventInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEventInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventInfoId } = req.params;
    const { name, description } = req.body;
    const eventInfo = await EventInfo.findByIdAndUpdate(
      eventInfoId,
      {
        name,
        description,
      },
      { new: true, runValidators: true },
    );
    if (!eventInfo) {
      throw new AppError(404, "Event info not found");
    }
    return res.status(200).send({
      success: true,
      message: "Event info updated successfully",
      eventInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEventInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventInfoId } = req.params;

    const eventInfo = await EventInfo.findByIdAndDelete(eventInfoId);
    if (!eventInfo) {
      throw new AppError(404, "Event info not found");
    }
    return res.status(200).send({
      success: true,
      message: "Event info deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
