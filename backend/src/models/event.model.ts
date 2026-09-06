import mongoose from "mongoose";
import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    imageUrl: z.string(),
    description: z.string().default("No description included"),
  }),
});
//
export const updateEventSchema = z.object({
  params: z.object({
    eventId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),

  body: z.object({
    name: z.string().min(1).optional(),
    seasonId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
      .optional(),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const eventIdParamSchema = z.object({
  params: z.object({
    eventId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - seasonId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: 60d5ecb8b5c9c22b1c8e4011
 *         name:
 *           type: string
 *           description: Name of the event
 *           example: Salakhana 2026
 *         seasonId:
 *           type: string
 *           description: MongoDB ObjectId reference to the associated Season
 *           example: 60d5ecb8b5c9c22b1c8e4012
 *         imageUrl:
 *           type: string
 *           description: URL or path to the event image
 *           example: https://example.com/images/event.png
 *         description:
 *           type: string
 *           default: "No description included"
 *           description: Description of the event
 *           example: The amazing salakhana of 2026
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated creation timestamp
 *           example: "2026-09-05T18:45:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated last update timestamp
 *           example: "2026-09-05T18:45:00.000Z"
 */
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    seasonId: {
      type: mongoose.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
      default: "No description included",
    },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
