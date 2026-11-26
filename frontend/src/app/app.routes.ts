import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        title: 'StayWise | Thoughtful stays across India',
        loadComponent: () => import('./features/home/home.page').then((page) => page.HomePage),
      },
      {
        path: 'hotels',
        title: 'Explore hotels | StayWise',
        loadComponent: () => import('./features/search-results/search-results.page').then((page) => page.SearchResultsPage),
      },
      {
        path: 'hotels/:id',
        title: 'Hotel details | StayWise',
        loadComponent: () => import('./features/hotel-details/hotel-details.page').then((page) => page.HotelDetailsPage),
      },
      {
        path: 'hotels/:id/book',
        title: 'Reserve your stay | StayWise',
        loadComponent: () => import('./features/booking/booking.page').then((page) => page.BookingPage),
      },
      {
        path: 'booking/confirmation/:reference',
        title: 'Booking confirmation | StayWise',
        loadComponent: () => import('./features/booking/confirmation.page').then((page) => page.ConfirmationPage),
      },
      {
        path: 'manage-booking',
        title: 'Manage booking | StayWise',
        loadComponent: () => import('./features/booking/manage-booking.page').then((page) => page.ManageBookingPage),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
