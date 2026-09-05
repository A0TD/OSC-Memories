import express from "express";
import { Request, Response } from "express";
import Event from "../models/event.model.js";
// import Media   from "../models/media.model.js"
import mongoose from "mongoose";

export const getAllEvents = async (req: Request, res: Response) => {
  const seasonId = req.params.seasonId;
  try{
  const allEvents = await Event.find({ seasonId: seasonId });

  if (!allEvents) {
    return res.status(404).send("There are no events yet");
  }
  res.status(200).send(allEvents);
 }catch(err){
  console.error("There is an error in getAllEvents" , err);
 }
};

export const getEvent = async (req: Request, res: Response) => {
  const{id} = req.params;
 try{
    const requiredEvent = await Event.findOne({_id: id});

    if(!requiredEvent){
      return res.status(404).send("the required event is not found");
    }

    //we need here to return all the media related to this event
    const allMediaRelated:any[] = [];

    res.status(200).json({
      requiredEvent , 
      allMediaRelated
    });
 }catch(err){
  console.error("There is an error in getEvent: " , err);
 }
};

export const createEvent = async (req: Request, res: Response) => {
    const { name, heroImageURL, description } = req.body;
    const seasonId:any = req.params.seasonid;
    const objectId = new mongoose.Types.ObjectId(seasonId);
  try{
  const newEvent = await Event.create({
    name: name,
    seasonId: objectId,
    heroImage: heroImageURL,
    description: description,
  });
  res.status(201).json(newEvent);
  }catch(err){
    console.error("There is an error in createEvent" , err);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const {id} = req.params;
  try{
     const requiredEvent = await Event.findOne({_id: id});

      if(!requiredEvent){
        return res.status(404).send("the required event is not found");
      }

      //we need to delete all media related to this event

     const unWantedEvent = await Event.deleteOne({_id: id});

     res.status(204).json({
       message: "Event is deleted correctly"
     });
  }catch(err){
    console.error("There is an error in deleteEvent" , err);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {name , heroImageURL , description} = req.body; 
  try{
      const updatedEvent = await Event.findByIdAndUpdate(
        id , 
        {
          name:name , 
          heroImage:heroImageURL, 
          description: description
        }
      );

      if(!updatedEvent){
        return res.status(404).send("the required event is not found");
      }

     res.status(201).json({
      message: "Event is updated" , 
      updatedEvent
     });
  }catch(err){
    console.error("There is an error in updateEvent" , err);
  }
};

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
