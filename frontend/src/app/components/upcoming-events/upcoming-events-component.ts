import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/event-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-events-component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }


  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Error fetching events', err)
    });
  }

  openEvent(id: string): void {
    this.router.navigate(['/event', id]);
  }
}