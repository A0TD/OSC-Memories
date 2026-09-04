import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String , 
        required: [true , "Name of this event is required"]
    },
    seasonId: {
        type: mongoose.Types.ObjectId,
        ref: "Season",
        required: [true , "season reference is required"],
    },
    heroImage:{
        type:String
    }, 
    description:{
        type:String , 
        default: "No description included"
    },
}, {timestamps: true});

const Event = mongoose.model("Event" , eventSchema);