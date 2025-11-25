import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events-component';
import { PastEventsComponent } from './components/past-events/past-events.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'upcoming-events', component: UpcomingEventsComponent },
  { path: 'past-events', component: PastEventsComponent },
  { path: '**', redirectTo: '' }               // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}