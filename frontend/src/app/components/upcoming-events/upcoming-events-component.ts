import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './upcoming-events-component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit {
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
          console.log(`Event: ${event.name}, Date: ${eventDate}, Is future: ${eventDate > now}`);
          return eventDate > now;
        });
        console.log('Filtered events:', this.events);
      },
      error: (err) => console.error('Error fetching events', err)
    });
  }

  openEvent(id: string): void {
    this.router.navigate(['/event', id]);
  }
}