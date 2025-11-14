// __tests__/event.list.frontend.test.ts
import { getAllEvents } from "../controllers/eventController";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Frontend Jest Test #2 - Get List of Objects", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("should return all events", async () => {
        const mockEvents = [
            { _id: "1", name: "Event One", status: "active" },
            { _id: "2", name: "Event Two", status: "inactive" },
        ];
        fetchMock.mockResponseOnce(JSON.stringify(mockEvents));

        const result = await getAllEvents();
        expect(result).toEqual(mockEvents);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/events");
    });

    it("should include specific event properties", async () => {
        const mockEvents = [{ _id: "1", name: "Event One", eventLink: "http://one.com", status: "active" }];
        fetchMock.mockResponseOnce(JSON.stringify(mockEvents));

        const result = await getAllEvents();
        expect(result[0]).toHaveProperty("name");
        expect(result[0]).toHaveProperty("eventLink");
        expect(result[0]).toHaveProperty("status");
    });

    it("should return empty array if no events exist", async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));

        const result = await getAllEvents();
        expect(result).toEqual([]);
    });
});
