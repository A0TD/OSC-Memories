import { Router } from "express";
import {
  getAllUsers,
  getUser,
  changeRole,
  deleteUser,
  getOwnUser,
  getOwnMedia,
  deleteOwnUser,
  updateOwnUser,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import validate from "../middlewares/zod.validation";
import paramSchema from "../zodSchemas/param.zodSchema";
import { getMediaByOwnerId } from "../controllers/media.controller";
import { updateOwnUserSchema } from "../zodSchemas/user.zodSchema";

const userRouter = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Users fetched successfully!
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
 *                   example: Users fetched successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     allUsers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
userRouter.get("/", authenticate, authorize("Admin"), getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User deleted successfully!
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
 *                   example: User deleted successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedUser:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
userRouter.delete(
  "/:userId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("userId")),
  deleteUser,
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     description: Retrieves the profile data of the currently logged-in user based on their authentication token.
 *     tags:
 *       - User
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
userRouter.get("/me", authenticate, getOwnUser);
/**
 * @swagger
 * /api/users/me/media:
 *   get:
 *     summary: Get all media owned by the authenticated user
 *     description: Retrieves all media items where the ownerId matches the currently authenticated user's ID.
 *     tags:
 *       - User
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
userRouter.get("/me/media", authenticate, getOwnMedia);
/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update the current authenticated user's profile
 *     description: Updates profile details (such as username) for the currently logged-in user.
 *     tags:
 *       - User
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
userRouter.patch(
  "/me",
  authenticate,
  validate(updateOwnUserSchema),
  updateOwnUser,
);
/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete the current authenticated user's profile
 *     description: Permanently deletes the logged-in user account, clears their session cookie, and removes associated media.
 *     tags:
 *       - User
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
userRouter.delete("/me", authenticate, deleteOwnUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User fetched successfully!
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
 *                   example: User fetched successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Invalid user ID format
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get(
  "/:userId",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("userId")),
  getUser,
);
/**
 * @swagger
 * /api/users/{userId}/role:
 *   patch:
 *     summary: Change user's role
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User has been promoted!
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
 *                   example: User has been promoted!
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedUser:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
userRouter.patch(
  "/:userId/role",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("userId")),
  changeRole,
);
/**
 * @swagger
 * /api/users/{userId}/media:
 *   get:
 *     summary: Get all media owned by the authenticated user
 *     description: Retrieves all media items where the ownerId matches the currently authenticated user's ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the user
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

userRouter.get(
  "/:userId/media",
  authenticate,
  authorize("Admin"),
  validate(paramSchema("userId")),
  getMediaByOwnerId,
);

export default userRouter;
