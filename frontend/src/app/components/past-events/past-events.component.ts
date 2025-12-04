import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-past-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css']
})
export class PastEventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const userId = this.authService.getUserId();
    this.eventService.getEvents(userId || undefined).subscribe({
      next: (data) => {
        const now = new Date();
        this.events = data.filter(event => {
          const eventDate = new Date(event.eventtimeid.startAt);
          return eventDate < now;
        });
      },
      error: (err) => console.error('Error fetching past events', err)
    });
  }

  openEvent(id: string): void {
    this.router.navigate(['/event', id]);
  }
}
