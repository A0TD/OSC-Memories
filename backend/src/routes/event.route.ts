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
import validate from "../middlewares/zod.validation";
import {
  createEventSchema,
  eventIdParamSchema,
  updateEventSchema,
} from "../models/event.model";

const eventRouter = Router({ mergeParams: true });

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Events retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *                     relatedMedia:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad Request - Validation error
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
eventRouter.get("/:eventId", validate(eventIdParamSchema), getEvent);
/**
 * @swagger
 * /seasons/{seasonId}/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the season
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Salakhana 2026
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/images/event.png
 *               description:
 *                 type: string
 *                 example: The amazing salakhana of 2026
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
eventRouter.post("/", validate(createEventSchema), createEvent);
/**
 * @swagger
 * /seasons/{seasonId}/events/{eventId}:
 *   put:
 *     summary: Update an existing event
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Event Name
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/images/new-event.png
 *               description:
 *                 type: string
 *                 example: Updated event description
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
eventRouter.put("/:eventId", validate(updateEventSchema), updateEvent);
/**
 * @swagger
 * /seasons/{seasonId}/events/{eventId}:
 *   delete:
 *     summary: Delete an event
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
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event deleted successfully
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
eventRouter.delete("/:eventId", validate(eventIdParamSchema), deleteEvent);

export default eventRouter;

// eventRouter.get("/:seasonId/:eventId/" , getEventPhotos);

// eventRouter.get("/:seasonId/:eventId/" , getEventVideos);
