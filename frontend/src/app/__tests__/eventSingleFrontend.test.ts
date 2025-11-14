import { getEventById } from "../controllers/eventController";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Frontend Jest Test #1 - Get Single Object", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("should return a single event by ID", async () => {
        const mockEvent = { _id: "123", name: "Test Event", status: "active" };
        fetchMock.mockResponseOnce(JSON.stringify(mockEvent));

        const result = await getEventById("123");
        expect(result).toEqual(mockEvent);
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/events/123");
    });

    it("should handle not found (404)", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Event not found" }),
            { status: 404 }
        );

        await expect(getEventById("999")).rejects.toThrow("Event not found");
    });

    it("should handle invalid ID format (500)", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Invalid ID format" }),
            { status: 500 }
        );

        await expect(getEventById("invalid-id")).rejects.toThrow("Invalid ID format");
    });
});
