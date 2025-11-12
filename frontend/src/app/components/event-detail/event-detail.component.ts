import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EventService, Event } from '../../services/event-service';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event = { _id: '', name: '', description: '', organizer: '', location: '', date: '' }; // initialize

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (data) => (this.event = data),
        error: (err) => console.error('Error fetching event', err)
      });
    }
  }
}