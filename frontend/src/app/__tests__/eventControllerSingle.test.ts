import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import Event from "../models/event";
import { getEventById } from "../controllers/eventController";

const app = express();
app.use(express.json());
app.get("/events/:id", getEventById);

describe("Jest Test #1 - Get Single Object (Event)", () => {
    let eventId: string;

    beforeAll(async () => {
        // Connect to in-memory MongoDB or test DB
        await mongoose.connect("mongodb://127.0.0.1:27017/testdb");

        // Seed one event
        const event = new Event({
            name: "Test Event",
            eventLink: "http://example.com",
            status: "active",
        });
        await event.save();
        eventId = event._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("should return a single event by ID", async () => {
        const res = await request(app).get(`/events/${eventId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", eventId);
        expect(res.body.name).toBe("Test Event");
    });

    it("should return 404 if event not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/events/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Event not found");
    });

    it("should handle invalid ID format", async () => {
        const res = await request(app).get("/events/invalid-id");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message");
    });
});
