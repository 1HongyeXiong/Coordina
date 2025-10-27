import Event from "../models/event.js";

// GET all Events
export const getAllEvents = async (req, res) => {
  try {
    const Events = await Event.find();
    res.json(Events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET Event by ID
export const getEventById = async (req, res) => {
  try {
    const Event = await Event.findById(req.params.id);
    if (!Event) return res.status(404).json({ message: "Event not found" });
    res.json(Event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create Event
export const createEvent = async (req, res) => {
  try {
    const { name, EventEmail, EventName } = req.body;
    const Event = new Event({ name, EventEmail, EventName });
    await Event.save();
    res.status(201).json(Event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};