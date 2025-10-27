import { Schema, model, Model, HydratedDocument, Types } from "mongoose";
import { AvailabilityResponse } from "./types";

export interface IEventTime {
  // UML vars
  startAt: number;                 // int startAt (you can switch to Date later)
  endAt: number;                   // int endAt
  duration?: number;               // int duration
  getAvailability?: AvailabilityResponse; // Enum getAvailability (optional/derived)
  eventSummary?: string[];         // string[] eventSummary
  // relationship
  eventID: Types.ObjectId;         // FK -> Event.eventID
}

type EventTimeModel = Model<IEventTime>;
export type EventTimeDoc = HydratedDocument<IEventTime>;

const eventTimeSchema = new Schema<IEventTime, EventTimeModel>(
  {
    startAt: { type: Number, required: true, index: true },
    endAt: { type: Number, required: true },
    duration: { type: Number, min: 1 },
    getAvailability: { type: String, enum: ["yes", "no", "maybe"], required: false },
    eventSummary: [{ type: String, trim: true }],
    eventID: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true }
  },
  { timestamps: true }
);

// (No methods here per your ask)

export const EventTime = model<IEventTime, EventTimeModel>("EventTime", eventTimeSchema);
