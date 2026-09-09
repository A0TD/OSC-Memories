import { Router } from "express";
import validate from "../middlewares/zod.validation";
import {
  createEventInfoSchema,
  updateEventInfoSchema,
} from "../zodSchemas/eventInfo.zodSchema";
import paramSchema from "../zodSchemas/param.zodSchema";
import {
  getAllEventInfos,
  getEventInfoById,
  createEventInfo,
  updateEventInfo,
  deleteEventInfo,
} from "../controllers/eventInfo.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const eventInfoRouter = Router();

/**
 * @swagger
 * /api/event-infos:
 *   get:
 *     summary: Retrieve a list of all event infos
 *     tags:
 *       - Event Info
 *     responses:
 *       200:
 *         description: A list of event infos retrieved successfully
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
 *                   example: Event infos retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     eventInfos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EventInfo'
 *       500:
 *         description: Internal server error
 */
eventInfoRouter.get("/", getAllEventInfos);

/**
 * @swagger
 * /api/event-infos/{eventInfoId}:
 *   get:
 *     summary: Retrieve a single event info by ID
 *     tags:
 *       - Event Info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the event info
 *     responses:
 *       200:
 *         description: Event info retrieved successfully
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
 *                   example: Event info retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     eventInfo:
 *                       $ref: '#/components/schemas/EventInfo'
 *       400:
 *         description: Bad Request - Validation error
 *       404:
 *         description: Not Found - Event info not found
 *       500:
 *         description: Internal server error
 */
eventInfoRouter.get(
  "/:eventInfoId",
  validate(paramSchema("eventInfoId")),
  getEventInfoById,
);

/**
 * @swagger
 * /api/event-infos:
 *   post:
 *     summary: Create a new event info
 *     tags:
 *       - Event Info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Game Jam"
 *               description:
 *                 type: string
 *                 example: "An event where games are showcased!"
 *     responses:
 *       201:
 *         description: Event info created successfully
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
 *                   example: Event info created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     eventInfo:
 *                       $ref: '#/components/schemas/EventInfo'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
eventInfoRouter.post(
  "/",
  authenticate,
  authorize("Admin"),
  validate(createEventInfoSchema),
  createEventInfo,
);

/**
 * @swagger
 * /api/event-infos/{eventInfoId}:
 *   put:
 *     summary: Update an existing event info by ID
 *     tags:
 *       - Event Info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the event info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Game Jam"
 *               description:
 *                 type: string
 *                 example: "Updated description for the Game Jam."
 *     responses:
 *       200:
 *         description: Event info updated successfully
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
 *                   example: Event info updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     eventInfo:
 *                       $ref: '#/components/schemas/EventInfo'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Not Found - Event info not found
 *       500:
 *         description: Internal server error
 */
eventInfoRouter.put(
  "/:eventInfoId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("eventInfoId")),
  validate(updateEventInfoSchema),
  updateEventInfo,
);

/**
 * @swagger
 * /api/event-infos/{eventInfoId}:
 *   delete:
 *     summary: Delete an event info by ID
 *     tags:
 *       - Event Info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the event info
 *     responses:
 *       200:
 *         description: Event info deleted successfully
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
 *                   example: Event info deleted successfully
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Not Found - Event info not found
 *       500:
 *         description: Internal server error
 */
eventInfoRouter.delete(
  "/:eventInfoId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("eventInfoId")),
  deleteEventInfo,
);

export default eventInfoRouter;
