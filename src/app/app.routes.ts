import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ContactPage } from './pages/contact-page/contact-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'contact', component: ContactPage },
];