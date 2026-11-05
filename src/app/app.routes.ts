import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { DocumentsPage } from './pages/documents-page/documents-page';
import { ServicesPage } from './pages/services-page/services-page';
import { AboutPage } from './pages/about-page/about-page';
import { MembershipPage } from './pages/membership-page/membership-page';
import { LoansPage } from './pages/loans-page/loans-page';
import { SavingsPage } from './pages/savings-page/savings-page';
import { TermsPage } from './pages/terms-page/terms-page';
import { PrivacyPage } from './pages/privacy/privacy';
import { ComingSoonPage } from './pages/coming-soon-page/coming-soon-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'contact', component: ContactPage },
  { path: 'documente', component: DocumentsPage },
  { path: 'servicii', component: ServicesPage },
  { path: 'despre', component: AboutPage },
  { path: 'devino-membru', component: MembershipPage },
  { path: 'imprumuturi', component: LoansPage },
  { path: 'economii', component: SavingsPage },
  { path: 'termeni-si-conditii', component: TermsPage },
  { path: 'confidentialitate', component: PrivacyPage },
  { path: 'in-curand', component: ComingSoonPage },
];