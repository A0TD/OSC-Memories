import express from "express"
import { Request , Response } from "express"
import Event from "../models/event.model.js";
// import Media   from "../models/media.model.js"
import mongoose from "mongoose";

export const getAllEvents = async (req:Request , res:Response) => {
  const seasonId:any = req.params.seasonId;
  const objectId = new mongoose.Types.ObjectId(seasonId)

  const allEvents = await Event.find({seasonId: objectId});

  if(!allEvents){
    return res.status(404).send("There are no events yet");
  }

  res.status(200).send(allEvents);
}

// export const getEventPhotos = async (req:Request , res:Response) => {
//     const eventId = req.params.eventid;
//     const type = req.query.type;
//     // const objectId = new mongoose.Types.ObjectId(eventId);

//     const allImagesRelated = await Media.find({eventId: eventId , type: type});

//     if(!allImagesRelated){
//       res.status(404).send("No iamges included");
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

export const createEvent = async (req:Request , res:Response) => {
    const {name , heroImageURL , description} = req.body;
    const seasonId:any = req.params.seasonid ;
    const objectId = new mongoose.Types.ObjectId(seasonId);

    const newEvent = await Event.create({
      name: name , 
      seasonId: objectId,
      heroImage: heroImageURL, 
      description: description
    });

    res.status(201).json(newEvent);
}