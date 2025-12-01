import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5001/api/events'; // backend base URL

  constructor(private http: HttpClient) {}

  // Get all events (optionally filtered by userId)
  getEvents(userId?: string): Observable<Event[]> {
    console.log('Fetching events from', this.apiUrl);
    
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }
    
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }
}
