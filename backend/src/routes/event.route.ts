import express from "express";
import { Router } from "express";
import {
  createEvent,
  getEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "../controllers/event.controller";
import mediaRouter from "./media.route";

const eventRouter = Router();

eventRouter.use("/:eventId/media", mediaRouter);

eventRouter.get("/", getAllEvents);

eventRouter.get("/:eventId", getEvent);

eventRouter.post("/", createEvent);

eventRouter.put("/:eventId", updateEvent);

eventRouter.delete("/:eventId", deleteEvent);

export default eventRouter;

// eventRouter.get("/:seasonId/:eventId/" , getEventPhotos);

// eventRouter.get("/:seasonId/:eventId/" , getEventVideos);
