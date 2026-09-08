import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";

const mediaSchema = new mongoose.Schema({
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
});

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
  const publicId = this.getQuery().publicId;
  await cloudinary.uploader.destroy(publicId);
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
