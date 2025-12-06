import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event-service';
import { Event } from '../models/event';
import { environment } from '../../environments/environment';

const EVENTS_URL = `${environment.apiConfig.baseUrl}/events`;

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should fetch all events', () => {
      const mockEvents: Event[] = [
        {
          _id: '1',
          name: 'Test Event 1',
          eventLink: 'https://example.com/event1',
          status: 'proposed',
          eventtimeid: {
            startAt: '2024-12-01T10:00:00Z',
            endAt: '2024-12-01T11:00:00Z'
          },
          organizerid: {
            name: 'John Doe',
            userEmail: 'john@example.com',
            userName: 'johndoe',
            numEvents: '5',
            role: 'organizer' as any
          },
          participantsid: []
        },
        {
          _id: '2',
          name: 'Test Event 2',
          eventLink: 'https://example.com/event2',
          status: 'scheduled',
          eventtimeid: {
            startAt: '2024-12-02T14:00:00Z',
            endAt: '2024-12-02T15:00:00Z'
          },
          organizerid: {
            name: 'Jane Doe',
            userEmail: 'jane@example.com',
            userName: 'janedoe',
            numEvents: '3',
            role: 'organizer' as any
          },
          participantsid: []
        }
      ];

      service.getEvents().subscribe(events => {
        expect(events.length).toBe(2);
        expect(events).toEqual(mockEvents);
      });

      const req = httpMock.expectOne(EVENTS_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should handle error when fetching events', () => {
      const errorMessage = 'Server error';

      service.getEvents().subscribe({
        next: () => fail('should have failed with server error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(EVENTS_URL);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should return empty array when no events exist', () => {
      service.getEvents().subscribe(events => {
        expect(events).toEqual([]);
      });

      const req = httpMock.expectOne(EVENTS_URL);
      req.flush([]);
    });
  });

  describe('getEventById', () => {
    it('should fetch a single event by ID', () => {
      const mockEvent: Event = {
        _id: '1',
        name: 'Test Event',
        eventLink: 'https://example.com/event',
        status: 'proposed',
        eventtimeid: {
          startAt: '2024-12-01T10:00:00Z',
          endAt: '2024-12-01T11:00:00Z'
        },
        organizerid: {
          name: 'John Doe',
          userEmail: 'john@example.com',
          userName: 'johndoe',
          numEvents: '5',
          role: 'organizer' as any
        },
        participantsid: []
      };

      service.getEventById('1').subscribe(event => {
        expect(event).toEqual(mockEvent);
        expect(event._id).toBe('1');
      });

      const req = httpMock.expectOne(`${EVENTS_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });

    it('should handle error when event not found', () => {
      service.getEventById('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${EVENTS_URL}/999`);
      req.flush('Event not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle network error', () => {
      service.getEventById('1').subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${EVENTS_URL}/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});

