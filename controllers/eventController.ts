import Event from "../models/event.ts";

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
    const Events = await Event.findById(req.params.id);
    if (!Events) return res.status(404).json({ message: "Event not found" });
    res.json(Events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create Event
export const createEvent = async (req, res) => {
  try {
    const { name, EventEmail, EventName } = req.body;
    const Events = new Event({ name, EventEmail, EventName });
    await Events.save();
    res.status(201).json(Events);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};