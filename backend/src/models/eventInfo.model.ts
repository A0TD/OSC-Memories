import mongoose from "mongoose";

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

eventInfoSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const EventInfo = mongoose.model("EventInfo", eventInfoSchema);

export default EventInfo;
