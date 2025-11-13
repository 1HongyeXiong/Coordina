import { Request, Response } from "express";
import Eventtime from "../models/eventtime";

// GET all Eventtimes
export const getAllEventtimes = async (req: Request, res: Response) => {
  try {
    const Eventtimes = await Eventtime.find();
    res.json(Eventtimes);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

// GET Eventtimes by ID
export const getEventtimeById = async (req: Request, res: Response) => {
  try {
    const Eventtimes = await Eventtime.findById(req.params.id);
    if (!Eventtimes) return res.status(404).json({ message: "Eventtimes not found" });
    res.json(Eventtimes);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

// POST create Eventtimes
export const createEventtime = async (req: Request, res: Response) => {
  try {
    console.log("Incoming event body:", req.body); 
    const { startAt, endAt } = req.body;
    const Eventtimes = new Eventtime({ startAt, endAt });
    await Eventtimes.save();
    res.status(201).json(Eventtimes);
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
};