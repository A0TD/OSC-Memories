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
 *         id:
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
  { timestamps: true },
);

seasonSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

//before deleting a season, delete all related events and media
seasonSchema.pre(["findOneAndDelete", "deleteOne"], async function () {
  const season = await this.model.findOne(this.getQuery(), "_id");
  if (season) {
    await Event.deleteMany({ seasonId: season._id });
  }
});

seasonSchema.pre("deleteMany", async function () {
  const seasons = await this.model.find(this.getQuery(), "_id");
  const seasonIds = seasons.map((season) => season._id);

  if (seasonIds.length > 0) {
    await Event.deleteMany({ seasonId: { $in: seasonIds } });
  }
});

const seasonModel = model("Season", seasonSchema);
export default seasonModel;
