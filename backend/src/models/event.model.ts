import mongoose from "mongoose";

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
 *         heroImage:
 *           type: string
 *           description: URL or path to the hero image
 *           example: https://example.com/images/hero.png
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

export default Event;