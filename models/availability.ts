import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        status: { type: String, enum: ["available", "unavailable", "maybe"], default: "available" },
        time: { type: dateTime}
    }
);


export default mongoose.model("Availability", availabilitySchema);
