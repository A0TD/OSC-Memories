import mongoose from "mongoose";
import { Schema,model } from "mongoose";
import Event from './event.model'


const seasonSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
},
{timestamps:true , strict: false}
)


//when delete a season  delete all the events related to it
seasonSchema.pre('findOneAndDelete',async function(){
const seasonId = this.getQuery()._id
await Event.deleteMany({seasonId})
})


const seasonModel = model("Season",seasonSchema)
export default seasonModel 