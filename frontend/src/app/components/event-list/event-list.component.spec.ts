import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EventListComponent } from './event-list.component';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

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

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    eventService.getEvents.and.returnValue(of(mockEvents));

    fixture.detectChanges();

    expect(eventService.getEvents).toHaveBeenCalled();
    expect(component.events).toEqual(mockEvents);
    expect(component.events.length).toBe(2);
  });

  it('should handle empty events list', () => {
    eventService.getEvents.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.events).toEqual([]);
    expect(component.events.length).toBe(0);
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

  it('should navigate to different event IDs', () => {
    component.openEvent('2');

    expect(router.navigate).toHaveBeenCalledWith(['/event', '2']);
  });
});

