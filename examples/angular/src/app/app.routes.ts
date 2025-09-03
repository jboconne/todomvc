import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'all', component: AppComponent },
  { path: 'active', component: AppComponent },
  { path: 'completed', component: AppComponent },
  { path: 'high-priority', component: AppComponent },
  { path: 'active-high-priority', component: AppComponent },
  { path: 'completed-high-priority', component: AppComponent },
  { path: '', redirectTo: '/all', pathMatch: 'full' },
];
