import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  syncMicrosoftId,
} from "../controllers/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/sync", syncMicrosoftId);

export default router;