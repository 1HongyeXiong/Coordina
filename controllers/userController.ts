import { Request, Response } from "express";
import User from "../models/user";

// GET all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST create user
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("Incoming event body:", req.body); 
    const { name, userEmail, userName } = req.body;
    const user = new User({ name, userEmail, userName });
    await user.save();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};