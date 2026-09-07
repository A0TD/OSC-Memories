import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  // name:{
  //     type: String ,
  // } ,
  eventId: {
    type: mongoose.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Image", "Video"],
    required: true,
  },
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
