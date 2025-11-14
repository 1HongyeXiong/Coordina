import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import Event from "../models/event";
import { getAllEvents } from "../controllers/eventController";

const app = express();
app.use(express.json());
app.get("/events", getAllEvents);

describe("Jest Test #2 - Get List of Objects (Events)", () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://127.0.0.1:27017/testdb");

        // Seed multiple events
        await Event.insertMany([
            { name: "Event One", eventLink: "http://one.com", status: "active" },
            { name: "Event Two", eventLink: "http://two.com", status: "inactive" },
        ]);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("should return all events", async () => {
        const res = await request(app).get("/events");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should include specific event properties", async () => {
        const res = await request(app).get("/events");
        expect(res.body[0]).toHaveProperty("name");
        expect(res.body[0]).toHaveProperty("eventLink");
        expect(res.body[0]).toHaveProperty("status");
    });

    it("should return empty array if no events exist", async () => {
        await Event.deleteMany({});
        const res = await request(app).get("/events");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});
