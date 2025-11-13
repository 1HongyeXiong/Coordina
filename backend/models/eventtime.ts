import mongoose from "mongoose";
const eventTimeSchema = new mongoose.Schema(
    {
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true }
    }
);
export default mongoose.model("Eventtime", eventTimeSchema);