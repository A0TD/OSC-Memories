import { NextFunction, Request, Response } from "express";
import Event from "../models/event.model.js";
// import Media   from "../models/media.model.js"
import AppError from "../utils/appError.util.js";

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
      data: {
        events: allEvents,
      },
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
      data: {
        event: requiredEvent,
      },
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
  const { name, imageUrl, description } = req.body;
  const { seasonId }: any = req.params;
  try {
    const newEvent = await Event.create({
      name: name,
      seasonId,
      imageUrl,
      description: description,
    });
    res.status(201).send({
      success: true,
      message: "Event created successfully",
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
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

    res.status(200).send({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { seasonId, eventId } = req.params;
  const { name, imageUrl, description } = req.body;
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, seasonId },
      {
        name: name,
        imageUrl,
        description: description,
      },
      { new: true },
    );

    if (!updatedEvent) {
      throw new AppError(404, "Event not found");
    }

    res.status(200).send({
      success: true,
      message: "Event updated successfully",
      data: {
        event: updatedEvent,
      },
    });
  } catch (err) {
    next(err);
  }
};

// export const getEventPhotos = async (req:Request , res:Response) => {

// export const getEventPhotos = async (req:Request , res:Response) => {
//     const eventId = req.params.eventid;
//     const type = req.query.type;
//     // const objectId = new mongoose.Types.ObjectId(eventId);

//     const allImagesRelated = await Media.find({eventId: eventId , type: type});

//     if(!allImagesRelated){
//       res.status(404).send("No images included");
//     }

//     res.status(200).send(allImagesRelated);
// }

// export const getEventVideos = async (req:Request , res:Response) => {
//     const eventId:any = req.params.eventid;
//     const objectId = new mongoose.Types.ObjectId(eventId);

//     const allVideosRelated = await Video.find({eventId: objectId});

//     if(!allVideosRelated){
//       res.status(404).send("No videos included");
//     }

//     res.status(200).send(allVideosRelated);
// }
