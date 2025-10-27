import mongoose from "mongoose";

/** Minimal “hello world” DB connector. */
export async function connectDB(uri = process.env.MONGODB_URI): Promise<void> {
  if (!uri) throw new Error("MONGODB_URI not set");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
