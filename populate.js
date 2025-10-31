// populate.js
// Run: mongo < populate.js
// or with mongosh: mongosh your-db-name populate.js

// Switch to the database
// use coordina;

// Drop existing collections for a clean slate
db.users.drop();
db.events.drop();
db.eventtimes.drop();
db.availabilities.drop();

// Insert sample users
const users = db.users.insertMany([
    {
        name: "Alice Organizer",
        userEmail: "alice@example.com",
        userName: "alice123",
        role: "organizer",
        numEvents: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Bob Participant",
        userEmail: "bob@example.com",
        userName: "bob321",
        role: "participant",
        numEvents: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Insert sample event
const event = db.events.insertMany([
    {
    name: "Team Sync Meeting",
    eventLink: "team-sync-2025",
    status: "proposed",
    organizerid: users.insertedIds["0"],
    participantsid: [users.insertedIds["1"]],
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    name: "Workshop Session",
    eventLink: "workshop-2025",
    status: "scheduled",
    organizerid: users.insertedIds["0"],
    participantsid: [users.insertedIds["1"]],
    createdAt: new Date(),
    updatedAt: new Date()
}
]);

// Insert sample event time slots
db.eventtimes.insertMany([
    {
        eventId: event.insertedId,
        startAt: new Date("2025-11-01T09:00:00Z"),
        endAt: new Date("2025-11-01T10:00:00Z")
    },
    {
        eventId: event.insertedId,
        startAt: new Date("2025-11-01T15:00:00Z"),
        endAt: new Date("2025-11-01T16:00:00Z")
    }
]);

// Insert sample availability
db.availabilities.insertOne({
    userId: users.insertedIds["1"],
    eventId: event.insertedId,
    status: "available",
    time: new Date("2025-11-01T09:00:00Z")
});

print("✅ Database populated with sample users, events, event times, and availability.");


