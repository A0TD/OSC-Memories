import mongoose from "mongoose";
import { z } from "zod";

export const createEventInfoSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().min(1, "Description is required"),
  }),
});

export const updateEventInfoSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    description: z
      .string()
      .trim()
      .min(1, "Description cannot be empty")
      .optional(),
  }),
});

export const eventInfoIdParamSchema = z.object({
  params: z.object({
    eventInfoId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
});
/**
 * @swagger
 * components:
 *   schemas:
 *     EventInfo:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           description: Auto-generated MongoDB ObjectId
 *           example: 60d5ecb8b5c9c22b1c8e4012
 *         name:
 *           type: string
 *           description: The name of the event
 *           example: "Game Jam"
 *         description:
 *           type: string
 *           description: Detailed description of the event
 *           example: "An event where games are showcased!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated creation timestamp
 *           example: "2026-09-07T01:30:19.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated last update timestamp
 *           example: "2026-09-07T01:30:19.000Z"
 */
const eventInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const EventInfo = mongoose.model("EventInfo", eventInfoSchema);

export default EventInfo;
