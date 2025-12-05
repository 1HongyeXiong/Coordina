import mongoose from "mongoose";
import User from "../models/user";          
import Event from "../models/event";        
import EventTime from "../models/eventtime";
import Availability from "../models/availability";

const MONGO_URI = "mongodb+srv://coordina_db_user:coordina@cluster0.tcbdna5.mongodb.net/coordina?appName=Cluster0";

async function run() {
     try {
        
        const mongoUri = MONGO_URI;
        if (!mongoUri) {
          throw new Error("MONGO_URI environment variable is not defined");
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // --------------------------------------
        // 🧹 CLEANUP — Clear existing data
        // --------------------------------------
        console.log("Cleaning existing collections...");

        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            EventTime.deleteMany({}),
            Availability.deleteMany({})
        ]);

        console.log("✔ Cleanup completed. Starting fresh population...");

        // --------------------------------------
        // 1️⃣ USERS — Insert 6 users
        // --------------------------------------
        const users = await User.insertMany([
            { name: "Ramya", userEmail: "rramesh@seattleu.edu", userName: "ramya" },
            { name: "Ramesh", userEmail: "ramesh@example.com", userName: "ramesh" },
            { name: "Hongye", userEmail: "hxiong@seattleu.edu", userName: "hongye" },
            { name: "Tony", userEmail: "tnguyen49@seattleu.edu",    userName: "tony" },
            { name: "Toan", userEmail: "toan_98146@yahoo.com", userName: "toan_98146" },
            { name: "Alice Brown", userEmail: "alice@example.com", userName: "alicebrown" }
        ]);

        console.log("Users inserted:", users.length);



       const eventTimes = [];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
            // Decide offset in hours: negative for past, positive for future
            // Example: 2 past, 3 future
            let offsetHours;
            if (i < 2) {
                offsetHours = -(i + 1) * 2; // past slots: -2h, -4h
            } else {
                offsetHours = (i - 1) * 2;  // future slots: 2h, 4h, 6h
            }

            const startAt = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
            const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1-hour slot

            const et = await EventTime.create({ startAt, endAt });
            eventTimes.push(et);
        }

        console.log("EventTimes created:", eventTimes.length);

        // --------------------------------------
        // 2️⃣ EVENTS — Insert 5 events
        // --------------------------------------
        const events = [];
        for (let i = 0; i < 5; i++) {
        const organizer = users[i % users.length]; // pick a user as organizer
        const eventtime = eventTimes[i]; // your Eventtime slot

        const event = await Event.create({
            name: `Event ${i + 1}`,
            eventLink: `https://example.com/event${i + 1}`,
            eventtimeid: eventtime._id,
            status: "proposed",
            organizerid: organizer._id,
            participantsid: users.map(u => u._id), // all users as participants
            date: eventtime.startAt,
            description: `Description for Event ${i + 1}`,
            location: `Location ${i + 1}`
        });

        events.push(event);
    }

        console.log("Events inserted:", events.length);

        // --------------------------------------
        // 4️⃣ AVAILABILITY — 125 entries
        // --------------------------------------

        const availabilityDocs = [];
        // Create a map of EventTime _id to EventTime object
        const eventTimeMap = new Map(eventTimes.map(et => [et._id.toString(), et]));


        // For each event, assign availability for each user for the linked eventtime
        for (let event of events) {
            const eventtime = eventTimeMap.get(event.eventtimeid.toString());
            if (!eventtime) continue;

            for (let user of users) {
                availabilityDocs.push({
                    userId: user._id,
                    eventId: event._id,
                    eventtimeid: eventtime._id,
                    status: ["available", "unavailable", "maybe"][Math.floor(Math.random() * 3)]
                });
            }
        }

        await Availability.insertMany(availabilityDocs);
        console.log("Availability entries inserted:", availabilityDocs.length);
        
        console.log("🎉 DATABASE POPULATED SUCCESSFULLY!");
        process.exit(0);

    } catch (err) {
        console.error("Error populating:", err);
        process.exit(1);
    }
}

run();