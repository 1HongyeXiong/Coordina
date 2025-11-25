import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UpcomingEventsComponent } from './upcoming-events-component';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';

describe('UpcomingEventsComponent', () => {
  let component: UpcomingEventsComponent;
  let fixture: ComponentFixture<UpcomingEventsComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  const createMockEvent = (name: string, daysOffset: number): Event => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return {
      _id: name,
      name: name,
      eventLink: `https://example.com/${name}`,
      status: 'proposed',
      eventtimeid: {
        startAt: date.toISOString(),
        endAt: new Date(date.getTime() + 3600000).toISOString()
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
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UpcomingEventsComponent],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingEventsComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and filter upcoming events on init', () => {
    const futureEvent = createMockEvent('Future Event', 5);
    const pastEvent = createMockEvent('Past Event', -5);
    const allEvents = [futureEvent, pastEvent];

    eventService.getEvents.and.returnValue(of(allEvents));

    fixture.detectChanges();

    expect(eventService.getEvents).toHaveBeenCalled();
    expect(component.events.length).toBe(1);
    expect(component.events[0].name).toBe('Future Event');
  });

  it('should filter out past events', () => {
    const futureEvent1 = createMockEvent('Future Event 1', 3);
    const futureEvent2 = createMockEvent('Future Event 2', 7);
    const pastEvent1 = createMockEvent('Past Event 1', -2);
    const pastEvent2 = createMockEvent('Past Event 2', -10);
    const allEvents = [futureEvent1, pastEvent1, futureEvent2, pastEvent2];

    eventService.getEvents.and.returnValue(of(allEvents));

    fixture.detectChanges();

    expect(component.events.length).toBe(2);
    expect(component.events.every(e => e.name.includes('Future'))).toBe(true);
  });

  it('should return empty array when all events are in the past', () => {
    const pastEvent1 = createMockEvent('Past Event 1', -1);
    const pastEvent2 = createMockEvent('Past Event 2', -5);
    const allEvents = [pastEvent1, pastEvent2];

    eventService.getEvents.and.returnValue(of(allEvents));

    fixture.detectChanges();

    expect(component.events.length).toBe(0);
  });

  it('should handle empty events list', () => {
    eventService.getEvents.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.events).toEqual([]);
  });

  it('should handle error when loading events', () => {
    const consoleSpy = spyOn(console, 'error');
    const error = new Error('Failed to fetch events');
    eventService.getEvents.and.returnValue(throwError(() => error));

    fixture.detectChanges();

    expect(eventService.getEvents).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching events', error);
    expect(component.events).toEqual([]);
  });

  it('should navigate to event detail when openEvent is called', () => {
    component.openEvent('1');

    expect(router.navigate).toHaveBeenCalledWith(['/event', '1']);
  });

  it('should not include events happening exactly now', () => {
    const nowEvent: Event = {
      _id: 'now',
      name: 'Now Event',
      eventLink: 'https://example.com/now',
      status: 'ongoing',
      eventtimeid: {
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 3600000).toISOString()
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

    eventService.getEvents.and.returnValue(of([nowEvent]));

    fixture.detectChanges();

    // Events happening now should not be included (eventDate > now is false)
    expect(component.events.length).toBe(0);
  });
});

