import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        eventLink: { type: String },
        eventtimeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Eventtime', required: true },
        status: { type: String, enum: ["proposed", "scheduled", "ongoing", "past"], default: "proposed" },
        organizerid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        participantsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        description: { type: String },
        location: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);