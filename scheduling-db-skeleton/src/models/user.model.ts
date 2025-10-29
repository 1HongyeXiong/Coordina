import { Schema, model, Model, HydratedDocument, Types } from "mongoose";

export interface IUser {
  // UML vars
  name?: string;                 // Name
  userEmail: string;             // userEmail
  // relationships (optional to store; often populated)
  organisedEvents?: Types.ObjectId[];     // +Event[] OrganisedEvents (virtual or denorm)
  participatingEvents?: Types.ObjectId[]; // +Event[] ParticipatingEvents
}

export interface IUserMethods {
  // UML methods (signatures only)
  getPastEvents(): Promise<unknown[]>;
  getUpcomingEvents(): Promise<unknown[]>;
  getOwningEvents(): Promise<unknown[]>;
  getParticipatingEvents(): Promise<unknown[]>;
  checkEventAccess(eventID: Types.ObjectId, userID: Types.ObjectId): Promise<boolean>;
  checkOwnerAccess(eventID: Types.ObjectId, userID: Types.ObjectId): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;
export type UserDoc = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, trim: true },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    }
    // NOTE: events can be virtuals; define if you want denorm arrays later.
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

// ----- method stubs (NO implementation) -----
userSchema.methods.getPastEvents = async function () { throw new Error("TODO"); };
userSchema.methods.getUpcomingEvents = async function () { throw new Error("TODO"); };
userSchema.methods.getOwningEvents = async function () { throw new Error("TODO"); };
userSchema.methods.getParticipatingEvents = async function () { throw new Error("TODO"); };
userSchema.methods.checkEventAccess = async function (_eventID, _userID) { if (eventParticipants.includes(_userID)) return true; throw new Error("TODO"); };
userSchema.methods.checkOwnerAccess = async function (_eventID, _userID) { if (eventOwner.equals(_userID)) return true; throw new Error("TODO"); };

export const User = model<IUser, UserModel>("User", userSchema);
