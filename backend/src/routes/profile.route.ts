import { Router } from "express";
import { getOwnMedia, getOwnUser } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";

const profileRouter = Router();
/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     description: Retrieves the profile data of the currently logged-in user based on their authentication token.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server error
 */
profileRouter.get("/me",authenticate, getOwnUser);
/**
 * @swagger
 * /api/profile/media:
 *   get:
 *     summary: Get all media owned by the authenticated user
 *     description: Retrieves all media items where the ownerId matches the currently authenticated user's ID.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     media:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Media'
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: Media not found
 *       500:
 *         description: Internal Server error
 */
profileRouter.get("/media",authenticate, getOwnMedia);

export default profileRouter