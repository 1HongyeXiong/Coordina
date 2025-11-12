import mongoose from "mongoose";
const eventTimeSchema = new mongoose.Schema(
    {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true }
    }
);
export default mongoose.model("EventTime", eventTimeSchema);