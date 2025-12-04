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
// if User Not found Create
export const findOrCreateUser = async (req: Request, res: Response) => {
  try {
    const { userEmail, name, userName } = req.body;
    let user = await User.findOne({ userEmail });
    if (!user) {
      user = new User({ name, userEmail, userName });
      await user.save();
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const syncMicrosoftId = async (req: Request, res: Response) => {
  try {
    const { userEmail, microsoftId, name } = req.body;

    // Input validation
    if (!userEmail || !microsoftId) {
      return res.status(400).json({ message: 'userEmail and microsoftId are required' });
    }
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    let user = await User.findOneAndUpdate(
      { userEmail },
      { microsoftId },
      { new: true }
    );
    // if not found, create new user with Microsoft profile data
    if (!user) {
      user = new User({ 
        userEmail,                    // From Microsoft account
        microsoftId,                  // Microsoft's unique ID
        name: name || userEmail,      // From Microsoft profile (e.g., "toan nguyen")
        userName: userEmail           // Use email as userName
      });
      await user.save();
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};