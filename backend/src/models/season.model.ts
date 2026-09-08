import { Schema, model } from "mongoose";
import Event from "./event.model";
import Media from "./media.model";

/**
 * @swagger
 * components:
 *   schemas:
 *     Season:
 *       type: object
 *       required:
 *         - name
 *         - date
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
 *         imageUrl:
 *           type: string
 *           description: URL of the season's cover image
 *           default: "https://placehold.co/600x400"
 *           example: "https://example.com/images/season.png"
 *         description:
 *           type: string
 *           description: Description of the season
 *           default: "No description included"
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
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400",
    },
    description: {
      type: String,
      trim: true,
      default: "No description included",
    },
  },
  { timestamps: true, strict: false },
);

//before deleting a season, delete all related events and media
seasonSchema.pre("findOneAndDelete", async function () {
  const seasonId = this.getQuery()._id;
  const events = await Event.find({ seasonId });
  const eventIds = events.map((event) => event._id);
  await Media.deleteMany({ eventId: { $in: eventIds } });
  await Event.deleteMany({ seasonId });
});

const seasonModel = model("Season", seasonSchema);
export default seasonModel;
