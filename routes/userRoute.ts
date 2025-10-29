import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
} from "../controllers/userController.ts";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;