/// <reference types="node" />
// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = "mongodb://admin:pass123@localhost:27017/coordina?authSource=admin";

    // const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;