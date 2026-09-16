import mongoose from "mongoose";

const deleteMediaRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mediaId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Media",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

deleteMediaRequestSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const DeleteMediaRequest = mongoose.model(
  "DeleteMediaRequest",
  deleteMediaRequestSchema,
);
