import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css']
})
export class PastEventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        const now = new Date();
        console.log('Current time:', now);
        console.log('All events:', data);
        this.events = data.filter(event => {
          const eventDate = new Date(event.eventtimeid.startAt);
          console.log(`Event: ${event.name}, Date: ${eventDate}, Is past: ${eventDate < now}`);
          return eventDate < now;
        });
        console.log('Filtered past events:', this.events);
      },
      error: (err) => console.error('Error fetching past events', err)
    });
  }

  openEvent(id: string): void {
    this.router.navigate(['/event', id]);
  }
}
