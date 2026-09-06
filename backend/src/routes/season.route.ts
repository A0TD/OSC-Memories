import {
  getAllSeasons,
  createSeason,
  getSeasonById,
  updateSeason,
  deleteSeason,
  deleteAllSeasons,
} from "../controllers/season.controller";
import { Router } from "express";
import eventRouter from "./event.route";
import validate from "../middlewares/zod.validation";
import { createSeasonSchema, seasonIdParamSchema, updateSeasonSchema } from "../models/season.model";

const seasonRouter = Router();

seasonRouter.use("/:seasonId/events", eventRouter);
/**
 * @swagger
 * /seasons:
 *   get:
 *     summary: Retrieve all seasons
 *     tags: 
 *       - Seasons
 *     responses:
 *       200:
 *         description: List of all seasons sorted by date descending
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Season'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch seasons
 *                 error:
 *                   type: object
 */
seasonRouter.get("/", getAllSeasons);
/**
 * @swagger
 * /seasons/{seasonId}:
 *   get:
 *     summary: Get a season by ID
 *     tags: 
 *       - Seasons
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the season
 *     responses:
 *       200:
 *         description: Season retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       404:
 *         description: Season not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Season not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch season
 *                 error:
 *                   type: object
 */
seasonRouter.get("/:seasonId",validate(seasonIdParamSchema), getSeasonById);
/**
 * @swagger
 * /seasons:
 *   post:
 *     summary: Create a new season
 *     tags: 
 *       - Seasons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: 2026 Season
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T00:00:00.000Z"
 *               description:
 *                 type: string
 *                 example: 2026 Season
 *     responses:
 *       201:
 *         description: Season created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: name, date, and description are required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create season
 *                 error:
 *                   type: object
 */
seasonRouter.post("/",validate(createSeasonSchema), createSeason);
/**
 * @swagger
 * /seasons/{seasonId}:
 *   put:
 *     summary: Update a season by ID
 *     tags: 
 *       - Seasons
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the season
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 2026 Updated Season
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-15T00:00:00.000Z"
 *               description:
 *                 type: string
 *                 example: Updated season description.
 *     responses:
 *       200:
 *         description: Season updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       404:
 *         description: Season not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Season not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update season
 *                 error:
 *                   type: object
 */
seasonRouter.put("/:seasonId",validate(updateSeasonSchema), updateSeason);
/**
 * @swagger
 * /seasons:
 *   delete:
 *     summary: Delete all seasons and their associated events
 *     tags: 
 *       - Seasons
 *     responses:
 *       200:
 *         description: All seasons and related events deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete all seasons
 *                 error:
 *                   type: object
 */
seasonRouter.delete("/", deleteAllSeasons);
/**
 * @swagger
 * /seasons/{seasonId}:
 *   delete:
 *     summary: Delete a season and its associated events
 *     tags: 
 *       - Seasons
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the season
 *     responses:
 *       200:
 *         description: Season and related events deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Season and its events deleted successfully
 *       404:
 *         description: Season not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Season not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete season
 *                 error:
 *                   type: object
 */
seasonRouter.delete("/:seasonId",validate(seasonIdParamSchema), deleteSeason);

export default seasonRouter;
