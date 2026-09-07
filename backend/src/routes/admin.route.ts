import {Router} from "express"
import { getAllUsers,makeAdmin,deleteUser } from "../controllers/admin.controller"

const adminRouter = Router()

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: 
 *       - Admin
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
adminRouter.get("/users",getAllUsers)
/**
 * @swagger
 * /api/admin/users/{userId}/make-admin:
 *   patch:
 *     summary: Promote a user to Admin
 *     tags: 
 *       - Admin
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
adminRouter.patch("/users/:userId/make-admin",makeAdmin)
/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: 
 *       - Admin
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
adminRouter.delete("/users/:userId",deleteUser)

export default adminRouter