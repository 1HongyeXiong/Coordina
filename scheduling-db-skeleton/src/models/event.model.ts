import { Schema, model, Model, HydratedDocument, Types } from "mongoose";
import { EventStatus, TimeZoneIANA, TimeFormat } from "./types";

export interface IEvent {
  // UML vars
  name: string;                 // Name
  eventLink?: string;           // eventLink
  status: EventStatus;          // Status
  date?: Date;                  // Date
  time?: string;                // Time (e.g., "17:30") – your choice
  timezone?: TimeZoneIANA;      // TimeZone
  timeformat?: TimeFormat;      // Timeformat
  eventParticipants: Types.ObjectId[];   // +User[] eventParticipants
  // relationships
  eventOwner: Types.ObjectId;            // FK -> User.userID (owns)
}

export interface IEventMethods {
  // UML methods (signatures only)
  getEventDetails(eventid: Types.ObjectId): Promise<unknown>;
  createEvent(eventid: Types.ObjectId): Promise<unknown>;
  generateEventLink(eventid: Types.ObjectId): string;
  getEventLink(): string;
  getPastEvents(): Promise<unknown[]>;
  getOwnerEvents(): Promise<unknown[]>;
  getParticipantEvents(): Promise<unknown[]>;
  setEventTime(): Promise<void>;
  calculateBestTime(): Promise<string[]>;
}

export interface IEventModel extends Model<IEvent, {}, IEventMethods> {}

export type EventDoc = HydratedDocument<IEvent, IEventMethods>;

const eventSchema = new Schema<IEvent, IEventModel, IEventMethods>(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    eventLink: { type: String, trim: true },
    status: { type: String, enum: ["draft", "open", "closed", "archived"], default: "draft", index: true },
    date: { type: Date },
    time: { type: String },
    timezone: { type: String, default: "UTC" },
    timeformat: { type: String, enum: ["12h", "24h"], default: "12h" },
    eventParticipants: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    eventOwner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

// ----- method stubs (NO implementation) -----
eventSchema.methods.getEventDetails = async function (_eventid) { throw new Error("TODO"); };
eventSchema.methods.createEvent = async function (_eventid) { throw new Error("TODO"); };
eventSchema.methods.generateEventLink = function (_eventid) { throw new Error("TODO"); };
eventSchema.methods.getEventLink = function () { throw new Error("TODO"); };
eventSchema.methods.getPastEvents = async function () { throw new Error("TODO"); };
eventSchema.methods.getOwnerEvents = async function () { throw new Error("TODO"); };
eventSchema.methods.getParticipantEvents = async function () { throw new Error("TODO"); };
eventSchema.methods.setEventTime = async function () { throw new Error("TODO"); };
eventSchema.methods.calculateBestTime = async function () { throw new Error("TODO"); };

export const Event = model<IEvent, IEventModel>("Event", eventSchema);
