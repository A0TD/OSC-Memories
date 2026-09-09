import {
  getAllMedia,
  getMedia,
  deleteMedia,
  uploadMedia,
} from "../controllers/media.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const mediaRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/seasons/{seasonId}/events/{eventId}/media:
 *   get:
 *     summary: Retrieve all media
 *     tags:
 *       - Media
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
 *         description: Successfully retrieved all media
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
 *                   example: Successfully retrieved all media!
 *                 allMedia:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *       500:
 *         description: Internal server error
 */
mediaRouter.get("/", getAllMedia);
/**
 * @swagger
 * /api/seasons/{seasonId}/events/{eventId}/media/{mediaId}:
 *   get:
 *     summary: Retrieve a single media item
 *     tags:
 *       - Media
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
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the media item
 *     responses:
 *       200:
 *         description: Successfully retrieved media
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
 *                   example: Successfully retrieved media!
 *                 foundMedia:
 *                   $ref: '#/components/schemas/Media'
 *       404:
 *         description: Media not found
 *       500:
 *         description: Internal server error
 */
mediaRouter.get("/:mediaId", getMedia);
/**
 * @swagger
 * /api/seasons/{seasonId}/events/{eventId}/media:
 *   post:
 *     summary: Upload media files
 *     tags:
 *       - Media
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - media
 *             properties:
 *               media:
 *                 type: array
 *                 description: Media files to upload (Maximum 5 files)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload successful
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
 *                   example: Upload successful
 *                 createdMedia:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *       400:
 *         description: Bad Request - Missing file upload
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */
mediaRouter.post(
  "/",
  authenticate,
  upload.array("media", 5), // 5 is the limit for a single upload.
  uploadMedia,
);
/**
 * @swagger
 * /api/seasons/{seasonId}/events/{eventId}/media/{mediaId}:
 *   delete:
 *     summary: Delete a media item
 *     tags:
 *       - Media
 *     security:
 *       - bearerAuth: []
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
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the media item
 *     responses:
 *       200:
 *         description: Media deleted successfully
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
 *                   example: Media deleted successfully!
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Media not found
 *       500:
 *         description: Internal server error
 */
mediaRouter.delete("/:mediaId", authenticate, deleteMedia);

export default mediaRouter;
