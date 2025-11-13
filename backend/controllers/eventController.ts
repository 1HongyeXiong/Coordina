import { Request, Response } from "express";
import Event from "../models/event";

// GET all Events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const Events = await Event.find();
    res.json(Events);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

// GET Event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const Events = await Event.findById(req.params.id)
      .populate("eventtimeid")
      .populate("organizerid")
      .populate("participantsid");
    if (!Events) return res.status(404).json({ message: "Event not found" });
    res.json(Events);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

// POST create Event
export const createEvent = async (req: Request, res: Response) => {
  try {
    console.log("Incoming event body:", req.body); 
    const { name, eventLink, eventtimeid, status, organizerid, participantsid } = req.body;
    const Events = new Event({ name, eventLink, eventtimeid, status, organizerid, participantsid });
    await Events.save();
    res.status(201).json(Events);
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
};