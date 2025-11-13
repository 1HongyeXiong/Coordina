import express from "express";
import {
  getAllEventtimes,
  getEventtimeById,
  createEventtime,
} from "../controllers/eventtimeController";

const router = express.Router();

router.get("/", getAllEventtimes);
router.get("/:id", getEventtimeById);
router.post("/", createEventtime);

export default router;