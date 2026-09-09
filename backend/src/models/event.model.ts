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
 *         id:
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
eventSchema.pre(["findOneAndDelete", "deleteOne"], async function () {
  const event = await this.model.findOne(this.getQuery(), "_id");
  if (event) {
    await Media.deleteMany({ eventId: event._id });
  }
});

eventSchema.pre("deleteMany", async function () {
  const events = await this.model.find(this.getQuery(), "_id");
  const eventIds = events.map((event) => event._id);

  if (eventIds.length > 0) {
    await Media.deleteMany({ eventId: { $in: eventIds } });
  }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
