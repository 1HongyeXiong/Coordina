import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    numEvents: { type: Number, default: 0 },
    role: { type: String, enum: ["organizer", "participant"], default: "participant" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);