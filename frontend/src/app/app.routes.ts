import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component'; // your home page

export const routes: Routes = [
  { path: '', component: AppComponent }, // home page
  { path: 'events', component: EventListComponent },
  { path: 'event/:id', component: EventDetailComponent },
];