import { TestBed } from "@angular/core/testing";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import { HttpErrorResponse } from "@angular/common/http";
import { EventService } from "../services/event-service";

interface EventDto {
    _id: string;
    name: string;
    eventLink: string;
    status: string;
}

describe("Jest Test #1 - Get Single Object (EventService)", () => {
    let service: EventService;
    let httpMock: HttpTestingController;
    const apiBaseUrl = "/api/events";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EventService],
        });

        service = TestBed.inject(EventService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should perform HTTP GET and return a single event by ID", (done) => {
        const mockId = "1234567890abcdef12345678";
        const mockEvent: EventDto = {
            _id: mockId,
            name: "Frontend Test Event",
            eventLink: "https://example.com/event",
            status: "active",
        };

        service.getEvent(mockId).subscribe((event) => {
            expect(event).toBeTruthy();
            expect(event._id).toBe(mockId);
            expect(event.name).toBe("Frontend Test Event");
            done();
        });

        const req = httpMock.expectOne(`${apiBaseUrl}/${mockId}`);
        expect(req.request.method).toBe("GET");
        req.flush(mockEvent);
    });

    it("should return an error when the event is not found (404)", (done) => {
        const missingId = "ffffffffffffffffffffffff";

        service.getEvent(missingId).subscribe({
            next: () => {
                // Should not get here
                fail("Expected an error, but got a successful response");
            },
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(404);
                expect(error.error).toEqual({ message: "Event not found" });
                done();
            },
        });

        const req = httpMock.expectOne(`${apiBaseUrl}/${missingId}`);
        expect(req.request.method).toBe("GET");
        req.flush({ message: "Event not found" }, { status: 404, statusText: "Not Found" });
    });

    it("should handle network or server errors (500)", (done) => {
        const eventId = "111111111111111111111111";

        service.getEvent(eventId).subscribe({
            next: () => {
                fail("Expected network/server error, but got success");
            },
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe("Server Error");
                done();
            },
        });

        const req = httpMock.expectOne(`${apiBaseUrl}/${eventId}`);
        expect(req.request.method).toBe("GET");
        req.flush(
            { message: "Internal Server Error" },
            { status: 500, statusText: "Server Error" }
        );
    });
});