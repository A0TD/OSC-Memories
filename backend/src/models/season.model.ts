import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import Event from "./event.model";
import { z } from "zod";

export const createSeasonSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    date: z.coerce.date(),
    description: z.string().trim().min(1).default("No description included"),
  }),
});

export const updateSeasonSchema = z.object({
  params: z.object({
    seasonId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
  body: z.object({
    name: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
    description: z.string().trim().min(1).optional(),
  }),
});

export const seasonIdParamSchema = z.object({
  params: z.object({
    seasonId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Season:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: 60d5ecb8b5c9c22b1c8e4010
 *         name:
 *           type: string
 *           description: Name of the season
 *           example: 2026 Season
 *         date:
 *           type: string
 *           format: date-time
 *           description: start and end date of the season
 *           example: "2026-03-01T00:00:00.000Z"
 *         description:
 *           type: string
 *           description: Description of the season
 *           example: The amazing 2026 season
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
const seasonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "No description included",
    },
  },
  { timestamps: true, strict: false },
);

//when delete a season  delete all the events related to it
seasonSchema.pre("findOneAndDelete", async function () {
  const seasonId = this.getQuery()._id;
  await Event.deleteMany({ seasonId });
});

const seasonModel = model("Season", seasonSchema);
export default seasonModel;
