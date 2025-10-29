import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        status: { type: String, enum: ["available", "unavailable", "maybe"], default: "available" },
        date: { type: Date, required: true },
        availableTime: { type: Date, required: true }
    }
);


export default mongoose.model("Availability", availabilitySchema);