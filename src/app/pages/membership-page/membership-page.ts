import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Benefit {
  title: string;
  text: string;
  icon: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  needs: string[];
  time?: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-membership-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './membership-page.html',
  styleUrl: './membership-page.css'
})
export class MembershipPage {
  @ViewChild('stepsRef') stepsRef!: ElementRef<HTMLElement>;
  // Toate elementele marcate cu #rv apar când ajung în ecran
  @ViewChildren('rv') revealTargets!: QueryList<ElementRef<HTMLElement>>;

  revealed = signal<string[]>([]);
  openFaq = signal<number | null>(0);

  benefits: Benefit[] = [
    { title: 'Economii cu dobândă', text: 'Banii depuși în fondul social pot beneficia de o dobândă de până la 5% pe an, conform condițiilor asociației.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { title: 'Contribuție în ritmul tău', text: 'Depui lunar între 30 și 800 lei, în funcție de posibilitățile și obiectivele tale.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { title: 'Acces la fondul tău', text: 'Poți solicita retragerea sumelor, în condițiile prevăzute de statut și de regulile asociației.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { title: 'Împrumuturi pentru membri', text: 'Ca membru, poți solicita împrumuturi cu dobândă fixă, în funcție de fondul social și de condițiile de creditare.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Condiții transparente', text: 'Taxa, contribuția și condițiile îți sunt prezentate clar, înainte de orice decizie.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'O comunitate unită', text: 'Faci parte dintr-o comunitate bazată pe solidaritate, responsabilitate și sprijin reciproc.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  steps: Step[] = [
    {
      number: '1',
      title: 'Completezi cererea de înscriere',
      description: 'Completezi o cerere de înscriere ca membru al asociației, conform statutului acesteia.',
      needs: ['Cererea de înscriere, completată conform statutului', 'Detaliile le primești la sediul asociației']
    },
    {
      number: '2',
      title: 'Achiți taxa de înscriere',
      description: 'Taxa de înscriere este de 30 lei, conform condițiilor asociației.',
      needs: ['Taxa de înscriere: 30 lei']
    },
    {
      number: '3',
      title: 'Stabilești contribuția lunară',
      description: 'Alegi suma pe care o depui lunar la fondul social, în funcție de posibilitățile și obiectivele tale de economisire.',
      needs: ['O contribuție lunară între 30 și 800 lei', 'Poți urmări estimarea în calculatorul din pagina Economii']
    },
    {
      number: '4',
      title: 'Economisești lunar',
      description: 'Depui contribuția aleasă, iar fondul tău social crește, cu dobândă de până la 5% pe an, conform condițiilor asociației.',
      needs: ['Contribuția lunară aleasă', 'La nevoie, poți solicita retragerea sumelor sau un împrumut, în condițiile statutului']
    }
  ];

  conditions: string[] = [
    'Să completezi cererea de înscriere, conform statutului',
    'Să achiți taxa de înscriere de 30 lei',
    'Să stabilești o contribuție lunară între 30 și 800 lei',
    'Să respecți statutul și regulamentele asociației'
  ];

  rights: string[] = [
    'Dobândă pentru sumele depuse, conform condițiilor asociației',
    'Posibilitatea de a solicita retragerea sumelor, conform statutului',
    'Posibilitatea de a solicita împrumuturi, în calitate de membru',
    'Informare clară asupra condițiilor, în orice moment'
  ];

  duties: string[] = [
    'Respectarea statutului și a regulamentelor asociației',
    'Plata taxei de înscriere și a contribuției lunare stabilite',
    'Furnizarea de informații corecte și actualizate',
    'Comportament corect față de ceilalți membri'
  ];

  faqs: Faq[] = [
    { question: 'Cine poate deveni membru?', answer: 'Condițiile de înscriere sunt cele prevăzute de statutul asociației. Dacă nu ești sigur că le îndeplinești, ne poți contacta, iar echipa noastră te îndrumă.' },
    { question: 'Cât costă înscrierea?', answer: 'Taxa de înscriere este de 30 lei. După înscriere, depui lunar contribuția aleasă la fondul social, între 30 și 800 lei.' },
    { question: 'Cât trebuie să depun lunar?', answer: 'Poți depune lunar o sumă între 30 și 800 lei, în funcție de posibilitățile și obiectivele tale de economisire.' },
    { question: 'Ce documente trebuie să pregătesc?', answer: 'Pentru înscriere completezi cererea conform statutului. Pentru un împrumut, documentele diferă pentru salariați și pensionari, iar lista o găsești în pagina Documente.' },
    { question: 'Pot renunța la calitatea de membru?', answer: 'Da, în condițiile prevăzute de statut. Detaliile procedurii ți le explicăm la înscriere, ca să știi de la început cum funcționează.' }
  ];

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const key = (entry.target as HTMLElement).dataset['key'];
            if (!key) return;

            this.revealed.update((list) => (list.includes(key) ? list : [...list, key]));
            observer.unobserve(entry.target);
          });
        },
        // Funcționează și pentru elemente foarte înalte (mobil)
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );

      this.revealTargets.forEach((target) => observer.observe(target.nativeElement));
    });
  }

  isOn(key: string): boolean {
    return this.revealed().includes(key);
  }

  toggleFaq(index: number) {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  scrollToSteps() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.stepsRef.nativeElement.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}