import { NextFunction, Request, Response } from "express";
import Event from "../models/event.model.js";
// import Media   from "../models/media.model.js"
import AppError from "../utils/appError.util.js";
import { uploadOne } from "../utils/uploadMedia.util.js";
import cloudinary from "../config/cloudinary.config.js";

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { seasonId } = req.params;
  try {
    const allEvents = await Event.find({ seasonId: seasonId });

    res.status(200).send({
      success: true,
      message: "Events retrieved successfully",
      events: allEvents,
    });
  } catch (err) {
    next(err);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { seasonId, eventId } = req.params;
  try {
    const requiredEvent = await Event.findOne({ _id: eventId, seasonId });

    if (!requiredEvent) {
      throw new AppError(404, "Event not found");
    }

    res.status(200).send({
      success: true,
      message: "Event retrieved successfully",
      event: requiredEvent,
    });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description } = req.body;
  const { seasonId }: any = req.params;
  const file = req.file as Express.Multer.File;
  let uploadedImage;
  try {
    if (file) {
      uploadedImage = await uploadOne(file);
    }

    const newEvent = await Event.create({
      name: name,
      seasonId,
      imageUrl: uploadedImage?.result.url,
      imagePublicId: uploadedImage?.result.public_id,
      description: description,
    });
    res.status(201).send({
      success: true,
      message: "Event created successfully",
      event: newEvent,
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

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { seasonId, eventId } = req.params;
  const { name, description } = req.body;
  const file = req.file as Express.Multer.File;
  let uploadedImage;
  try {
    const foundEvent = await Event.findOne({ _id: eventId, seasonId });

    if (!foundEvent) {
      throw new AppError(404, "Event not found");
    }
    if (file) {
      uploadedImage = await uploadOne(file);
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, seasonId },
      {
        name: name,
        imageUrl: uploadedImage?.result.url,
        imagePublicId: uploadedImage?.result.public_id,
        description: description,
      },
      { new: true },
    );

    if (file && foundEvent.imagePublicId) {
      await cloudinary.uploader
        .destroy(foundEvent.imagePublicId)
        .catch(() => {});
    }

    res.status(200).send({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
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

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { seasonId, eventId } = req.params;
  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: eventId,
      seasonId,
    });

    if (!deletedEvent) {
      throw new AppError(404, "Event not found");
    }
    //we need to delete all media related to this event
    if (deletedEvent.imagePublicId)
      await cloudinary.uploader
        .destroy(deletedEvent.imagePublicId)
        .catch(() => {});

    res.status(200).send({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
