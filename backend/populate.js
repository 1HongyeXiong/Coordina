// populate.js
// Run with: mongosh coordina populate.js

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
    },
    {
        name: "Charlie Participant",
        userEmail: "charlie@example.com",
        userName: "charlie456",
        role: "participant",
        numEvents: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

print("✅ Created users: 3");

// Create event times
const eventTimes = db.eventtimes.insertMany([
    {
        startAt: new Date("2025-11-10T09:00:00Z"),
        endAt: new Date("2025-11-10T10:00:00Z")
    },
    {
        startAt: new Date("2025-11-20T15:00:00Z"),
        endAt: new Date("2025-11-20T16:00:00Z")
    },
    {
        startAt: new Date("2025-12-01T10:00:00Z"),
        endAt: new Date("2025-12-01T11:30:00Z")
    }
]);

print("✅ Created event times: 3");

// Create events with proper eventtime links
db.events.insertMany([
    {
        name: "Team Sync Meeting",
        eventLink: "team-sync-2025",
        status: "proposed",
        organizerid: users.insertedIds["0"],
        participantsid: [users.insertedIds["1"], users.insertedIds["2"]],
        eventtimeid: eventTimes.insertedIds["0"],
        description: "Weekly team synchronization meeting",
        location: "Conference Room A",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Project Kickoff",
        eventLink: "project-kickoff",
        status: "scheduled",
        organizerid: users.insertedIds["0"],
        participantsid: [users.insertedIds["1"]],
        eventtimeid: eventTimes.insertedIds["1"],
        description: "Kickoff meeting for the new project",
        location: "Main Office",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Year-end Review",
        eventLink: "year-end-review",
        status: "proposed",
        organizerid: users.insertedIds["0"],
        participantsid: [users.insertedIds["1"], users.insertedIds["2"]],
        eventtimeid: eventTimes.insertedIds["2"],
        description: "Annual performance review meeting",
        location: "Virtual",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

print("✅ Created events: 3");
print("🎉 Database populated successfully!");
print("Events created:");
print("- Team Sync Meeting (proposed)");
print("- Project Kickoff (scheduled)");
print("- Year-end Review (proposed)");

