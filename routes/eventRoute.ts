import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
} from "../controllers/eventController.ts";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);

export default router;