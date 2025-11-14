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

describe("Jest Test #2 - Get List of Objects (EventService)", () => {
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

    it("should perform HTTP GET and return a list of events", (done) => {
        const mockEvents: EventDto[] = [
            {
                _id: "1",
                name: "Event One",
                eventLink: "https://example.com/1",
                status: "active",
            },
            {
                _id: "2",
                name: "Event Two",
                eventLink: "https://example.com/2",
                status: "inactive",
            },
        ];

        service.getEvents().subscribe((events) => {
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBe(2);
            expect(events[0].name).toBe("Event One");
            expect(events[1].status).toBe("inactive");
            done();
        });

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe("GET");
        req.flush(mockEvents);
    });

    it("should return an empty array when no events exist", (done) => {
        service.getEvents().subscribe((events) => {
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBe(0);
            done();
        });

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe("GET");
        req.flush([]);
    });

    it("should handle server error when fetching event list (500)", (done) => {
        service.getEvents().subscribe({
            next: () => {
                fail("Expected server error, but got success");
            },
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
                expect(error.statusText).toBe("Server Error");
                done();
            },
        });

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe("GET");
        req.flush(
            { message: "Internal Server Error" },
            { status: 500, statusText: "Server Error" }
        );
    });
});