import { Request, Response } from "express";
import Event from "../models/event.model.js";
// import Media   from "../models/media.model.js"
import mongoose from "mongoose";

export const getAllEvents = async (req: Request, res: Response) => {
  const {seasonId} = req.params;
  try {
    const allEvents = await Event.find({ seasonId: seasonId });

    if (allEvents.length === 0) {
      return res.status(404).send("There are no events yet");
    }
    res.status(200).send(allEvents);
  } catch (err) {
    console.error("There is an error in getAllEvents", err);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const requiredEvent = await Event.findOne({ _id: eventId });

    if (!requiredEvent) {
      return res.status(404).send("the required event is not found");
    }

    //we need here to return all the media related to this event
    const allMediaRelated: any[] = [];

    res.status(200).json({
      requiredEvent,
      allMediaRelated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server failed to get all events" , 
      error: err
    });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { name, heroImageURL, description } = req.body;
  const {seasonId}:any = req.params;
  const objectId = new mongoose.Types.ObjectId(seasonId);
  try {
    const newEvent = await Event.create({
      name: name,
      seasonId: objectId,
      heroImage: heroImageURL,
      description: description,
    });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({
      message: "Server failed to get event" , 
      error: err
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const requiredEvent = await Event.findOne({ _id: eventId });

    if (!requiredEvent) {
      return res.status(404).send("the required event is not found");
    }

    //we need to delete all media related to this event

     await Event.deleteOne({ _id: eventId });

    res.status(204).send("event deleted correctly");
    
  } catch (err) {
    res.status(500).json({
      message: "Server failed to delete event" , 
      error: err
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { name, heroImageURL, description } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, {
      name: name,
      heroImage: heroImageURL,
      description: description,
    });

    if (!updatedEvent) {
      return res.status(404).send("the required event is not found");
    }

    res.status(201).json({
      message: "Event is updated",
      updatedEvent,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server failed to update event" , 
      error: err
    });
  }
};

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
