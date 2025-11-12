import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },    
  { path: 'events', component: EventListComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: '**', redirectTo: '' }               // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}