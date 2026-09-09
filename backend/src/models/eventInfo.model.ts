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
 *         id:
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
