import "dotenv/config";
import { connectDB, disconnectDB } from "../db/connect";
import { User, Event, EventTime, Availability } from "../models";

async function main() {
  await connectDB();

  // Touch models so you know imports work.
  console.log("✅ Models loaded:", {
    User: User.modelName,
    Event: Event.modelName,
    EventTime: EventTime.modelName,
    Availability: Availability.modelName
  });

  await disconnectDB();
  console.log("👋 Hello from scheduling DB skeleton.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
