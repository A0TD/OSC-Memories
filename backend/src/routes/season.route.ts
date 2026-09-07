import {
  getAllSeasons,
  createSeason,
  getSeasonById,
  updateSeason,
  deleteSeason,
} from "../controllers/season.controller";
import { Router } from "express";
import eventRouter from "./event.route";
import validate from "../middlewares/zod.validation";
import {
  createSeasonSchema,
  updateSeasonSchema,
} from "../zodSchemas/season.zodSchema";
import paramSchema from "../zodSchemas/param.zodSchema";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const seasonRouter = Router();

seasonRouter.use(
  "/:seasonId/events",
  validate(paramSchema("seasonId")),
  eventRouter,
);
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Seasons retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     seasons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Season'
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server error
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Season retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     season:
 *                       $ref: '#/components/schemas/Season'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Season not found
 *       500:
 *         description: Internal Server error
 */
seasonRouter.get(
  "/:seasonId",
  validate(paramSchema("seasonId")),
  getSeasonById,
);
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: 2026 Season
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T00:00:00.000Z"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/images/season.png"
 *               description:
 *                 type: string
 *                 example: 2026 Season
 *     responses:
 *       201:
 *         description: Season created successfully
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
 *                   example: Season created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     season:
 *                       $ref: '#/components/schemas/Season'
 *       400:
 *         description: Bad Request - Missing required fields or validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal Server error
 */
seasonRouter.post(
  "/",
  authenticate,
  authorize("Admin"),
  validate(createSeasonSchema),
  createSeason,
);
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
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/images/updated-season.png"
 *               description:
 *                 type: string
 *                 example: Updated season description.
 *     responses:
 *       200:
 *         description: Season updated successfully
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
 *                   example: Season updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     season:
 *                       $ref: '#/components/schemas/Season'
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Season not found
 *       500:
 *         description: Internal Server error
 */
seasonRouter.put(
  "/:seasonId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("seasonId")),
  validate(updateSeasonSchema),
  updateSeason,
);

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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Season and its events deleted successfully
 *       400:
 *         description: Bad Request - Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Season not found
 *       500:
 *         description: Server error
 */
seasonRouter.delete(
  "/:seasonId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("seasonId")),
  deleteSeason,
);

export default seasonRouter;
