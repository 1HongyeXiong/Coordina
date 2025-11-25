import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { UserRole } from '../../models/user';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let activatedRoute: any;

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
      role: UserRole.ORGANIZER
    },
    participantsid: [
      {
        name: 'Jane Doe',
        userEmail: 'jane@example.com',
        userName: 'janedoe',
        numEvents: '3',
        role: UserRole.PARTICIPANT
      }
    ]
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById']);
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EventDetailComponent],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load event on init', () => {
    eventService.getEventById.and.returnValue(of(mockEvent));

    fixture.detectChanges();

    expect(eventService.getEventById).toHaveBeenCalledWith('1');
    expect(component.event._id).toBe('1');
    expect(component.event.name).toBe('Test Event');
    expect(component.event.organizerid.name).toBe('John Doe');
  });

  it('should populate all event fields correctly', () => {
    eventService.getEventById.and.returnValue(of(mockEvent));

    fixture.detectChanges();

    expect(component.event.name).toBe(mockEvent.name);
    expect(component.event.eventLink).toBe(mockEvent.eventLink);
    expect(component.event.status).toBe(mockEvent.status);
    expect(component.event.eventtimeid.startAt).toBe(mockEvent.eventtimeid.startAt);
    expect(component.event.eventtimeid.endAt).toBe(mockEvent.eventtimeid.endAt);
    expect(component.event.organizerid.name).toBe(mockEvent.organizerid.name);
    expect(component.event.organizerid.userEmail).toBe(mockEvent.organizerid.userEmail);
    expect(component.event.organizerid.userName).toBe(mockEvent.organizerid.userName);
    expect(component.event.participantsid.length).toBe(1);
  });

  it('should handle error when loading event', () => {
    const consoleSpy = spyOn(console, 'error');
    const error = new Error('Failed to fetch event');
    eventService.getEventById.and.returnValue(throwError(() => error));

    fixture.detectChanges();

    expect(eventService.getEventById).toHaveBeenCalledWith('1');
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching event', error);
  });

  it('should not load event if no ID in route', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue(null);
    eventService.getEventById.and.returnValue(of(mockEvent));

    component.ngOnInit();

    expect(eventService.getEventById).not.toHaveBeenCalled();
  });

  describe('getBackRoute', () => {
    it('should return /upcoming-events for future events', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      component.event.eventtimeid.startAt = futureDate.toISOString();

      const route = component.getBackRoute();

      expect(route).toBe('/upcoming-events');
    });

    it('should return /past-events for past events', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      component.event.eventtimeid.startAt = pastDate.toISOString();

      const route = component.getBackRoute();

      expect(route).toBe('/past-events');
    });

    it('should return /past-events for events happening now', () => {
      const now = new Date();
      component.event.eventtimeid.startAt = now.toISOString();

      const route = component.getBackRoute();

      expect(route).toBe('/past-events');
    });
  });
});

