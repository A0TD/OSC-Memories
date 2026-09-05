import express from "express"
import { Router } from "express"
import { getAllEvents} from "../controllers/event.controller.js";


const eventRouter = Router();

//get all events related to specific season
eventRouter.get("/:seasonid" , getAllEvents);

//get images of a specific event
// eventRouter.get("/:seasonid/:eventid/" , getEventPhotos);

// //get videos of a specific event
// eventRouter.get("/:seasonid/:eventid/" , getEventVideos);