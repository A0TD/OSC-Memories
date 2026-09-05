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
/**
 * @swagger
 * /seasons/{seasonId}/events:
 *   get:
 *     summary: Get all events for a season
 *     tags: 
 *       - Events
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the season
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: No events found for the specified season
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "There are no events yet"
 */
eventRouter.get("/", getAllEvents);
/**
 * @swagger
 * /seasons/{seasonId}/events/{eventId}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: 
 *       - Events
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the season
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Event retrieved successfully along with related media
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requiredEvent:
 *                   $ref: '#/components/schemas/Event'
 *                 allMediaRelated:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Event not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "the required event is not found"
 */
eventRouter.get("/:eventId", getEvent);

eventRouter.post("/", createEvent);

eventRouter.put("/:eventId", updateEvent);

eventRouter.delete("/:eventId", deleteEvent);

export default eventRouter;

// eventRouter.get("/:seasonId/:eventId/" , getEventPhotos);

// eventRouter.get("/:seasonId/:eventId/" , getEventVideos);
