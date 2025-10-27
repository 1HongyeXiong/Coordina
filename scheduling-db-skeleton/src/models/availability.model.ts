import { Schema, model, Model, HydratedDocument, Types } from "mongoose";
import { AvailabilityResponse, TimeZoneIANA, TimeFormat } from "./types";

export interface IAvailability {
  // UML vars
  status: AvailabilityResponse;    // AvailabilityEnum status
  date?: Date;                     // DateTime Date
  availableTime?: Map<string, unknown>; // Map AvailableTime
  maybeTime?: Map<string, unknown>;     // Map MaybeTime
  timezone?: TimeZoneIANA;         // TimeZone timezone
  timeformat?: TimeFormat;         // Timeformat timeformat
  // relationships
  eventID: Types.ObjectId;         // FK -> Event.eventID
  userID: Types.ObjectId;          // FK -> User.userID
}

export interface IAvailabilityMethods {
  setState(): Promise<void>;
  getTime(): Promise<number>;
  isYes(): boolean;
  isAvailable(): boolean;
}

type AvailabilityModel = Model<IAvailability, {}, IAvailabilityMethods>;
export type AvailabilityDoc = HydratedDocument<IAvailability, IAvailabilityMethods>;

const availabilitySchema = new Schema<IAvailability, AvailabilityModel, IAvailabilityMethods>(
  {
    status: { type: String, enum: ["yes", "no", "maybe"], default: "maybe", required: true },
    date: { type: Date },
    availableTime: { type: Map, of: Schema.Types.Mixed },
    maybeTime: { type: Map, of: Schema.Types.Mixed },
    timezone: { type: String, default: "UTC" },
    timeformat: { type: String, enum: ["12h", "24h"], default: "12h" },
    eventID: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

// ----- method stubs (NO implementation) -----
availabilitySchema.methods.setState = async function () { throw new Error("TODO"); };
availabilitySchema.methods.getTime = async function () { throw new Error("TODO"); };
availabilitySchema.methods.isYes = function () { throw new Error("TODO"); };
availabilitySchema.methods.isAvailable = function () { throw new Error("TODO"); };

export const Availability = model<IAvailability, AvailabilityModel>("Availability", availabilitySchema);
