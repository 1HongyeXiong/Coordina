import { Eventtime } from "./eventtime";
import { User } from "./user";

export interface Event {
  _id: string;
  name: string;
  eventLink: string;
  status: string;
  eventtimeid: Eventtime;
  organizerid: User;
  participantsid: User[];
  location?: string;
  description?: string;
}