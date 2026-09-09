import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       required:
 *         - ownerId
 *         - eventId
 *         - url
 *         - mimeType
 *         - publicId
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *           description: Auto-generated MongoDB ObjectId (transformed from _id)
 *           example: 60d5ecb8b5c9c22b1c8e4011
 *         ownerId:
 *           type: string
 *           description: MongoDB ObjectId reference to the User who uploaded the media
 *           example: 60d5ecb8b5c9c22b1c8e4012
 *         eventId:
 *           type: string
 *           description: MongoDB ObjectId reference to the associated Event
 *           example: 60d5ecb8b5c9c22b1c8e4013
 *         url:
 *           type: string
 *           description: Secure Cloudinary CDN URL of the uploaded file
 *           example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 *         mimeType:
 *           type: string
 *           description: MIME type of the uploaded file
 *           example: image/jpeg
 */
const mediaSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

mediaSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.publicId;
    return ret;
  },
});

mediaSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getQuery());
  const { publicId } = doc;
  await cloudinary.uploader.destroy(publicId);
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
