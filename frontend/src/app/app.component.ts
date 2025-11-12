import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Event {
  name: string;
  status: string;
  eventLink?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  API_URL = 'http://localhost:5001/api/events';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Event[]>(this.API_URL).subscribe(
      (data) => {
        this.upcomingEvents = data.filter(e => e.status === 'scheduled' || e.status === 'ongoing').slice(0, 5);
        this.pastEvents = data.filter(e => e.status === 'past').slice(0, 5);
      },
      (error) => {
        console.error('Failed to load events', error);
        this.upcomingEvents = [];
        this.pastEvents = [];
      }
    );
  }
}