import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events-component';
import { PastEventsComponent } from './components/past-events/past-events.component';
import { MsalGuard } from '@azure/msal-angular';
import { MsalRedirectComponent } from '@azure/msal-angular';


export const routes: Routes = [
  { path: '', component: HomeComponent },    
  { path: 'events', component: EventListComponent, canActivate: [MsalGuard] },
  { path: 'event/:id', component: EventDetailComponent, canActivate: [MsalGuard] },
  { path: 'upcoming-events', component: UpcomingEventsComponent, canActivate: [MsalGuard] },
  { path: 'past-events', component: PastEventsComponent, canActivate: [MsalGuard] },
  { path: 'auth', component: MsalRedirectComponent },
  { path: '**', redirectTo: '' }               // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}