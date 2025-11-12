import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  _id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  organizer: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5001/api/events'; // backend base URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    console.log('Fetching events from', this.apiUrl);
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }
}