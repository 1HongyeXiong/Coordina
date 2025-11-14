import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event-service';
import { Event } from '../../models/event';
import { UserRole } from '../../models/user';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event = { _id: '', name: '', eventLink: '', eventtimeid: 
    {
      startAt: new Date().toISOString(),
      endAt: new Date().toISOString()
    }, 
    status: '', 
    organizerid:
    {
      name: '', userEmail: '', userName: '', numEvents: '', role: UserRole.ORGANIZER
    }, participantsid: [] }; // initialize

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(id).subscribe({
        next: (data) => 
          {
            console.log('Fetched event data:', data);
            this.event._id = data._id;
            this.event.name = data.name;
            this.event.eventLink = data.eventLink;
            this.event.eventtimeid.startAt = data.eventtimeid.startAt;
            this.event.eventtimeid.endAt = data.eventtimeid.endAt;
            this.event.status = data.status;
            this.event.organizerid.name = data.organizerid.name;
            this.event.organizerid.userEmail = data.organizerid.userEmail;
            this.event.organizerid.userName = data.organizerid.userName;
            this.event.organizerid.numEvents = data.organizerid.numEvents;
            this.event.participantsid = data.participantsid;
          },
        error: (err) => console.error('Error fetching event', err)
      });
    }
  }

  getBackRoute() {
  const eventDate = new Date(this.event.eventtimeid.startAt);
  console.log('Event date for back route:', eventDate);
  return eventDate > new Date() ? '/upcoming-events' : '/past-events';
}

}