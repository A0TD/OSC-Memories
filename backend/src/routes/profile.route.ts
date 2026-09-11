import { Router } from "express";
import {
  getOwnMedia,
  getOwnUser,
  updateUser,
  deleteUser,
} from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";

const profileRouter = Router();
/**
 * @swagger
 * /api/profile:
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
profileRouter.get("/", authenticate, getOwnUser);
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
profileRouter.get("/media", authenticate, getOwnMedia);
/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Update the current authenticated user's profile
 *     description: Updates profile details (such as username) for the currently logged-in user.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The new username
 *                   example: johndoe_updated
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Validation error or invalid input
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server error
 */
profileRouter.patch("/", authenticate, updateUser);
/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete the current authenticated user's profile
 *     description: Permanently deletes the logged-in user account, clears their session cookie, and removes associated media.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
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
profileRouter.delete("/", authenticate, deleteUser);

export default profileRouter;
