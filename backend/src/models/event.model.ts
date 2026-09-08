import mongoose from "mongoose";
import Media from "./media.model";

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
 *           readOnly: true
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
 *           default: "https://placehold.co/600x400"
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
      required: true,
    },
    seasonId: {
      type: mongoose.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400",
    },
    description: {
      type: String,
      default: "No description included",
    },
  },
  { timestamps: true },
);

eventSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

//before deleting an event, delete all related media
eventSchema.pre("findOneAndDelete", async function () {
  const eventId = this.getQuery()._id;
  await Media.deleteMany({ eventId });
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
