import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Service {
  number: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  icon: string;
  image: string;
  imagePosition?: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-page.html',
  styleUrl: './services-page.css'
})
export class ServicesPage {
  @ViewChild('statsRef') statsRef!: ElementRef<HTMLElement>;
  @ViewChild('faqRef') faqRef!: ElementRef<HTMLElement>;
  @ViewChild('ctaRef') ctaRef!: ElementRef<HTMLElement>;
  @ViewChild('infoRef') infoRef!: ElementRef<HTMLElement>;
  @ViewChildren('serviceBlock') serviceBlocks!: QueryList<ElementRef<HTMLElement>>;

  statsVisible = signal(false);
  faqVisible = signal(false);
  ctaVisible = signal(false);
  infoVisible = signal(false);
  visibleServices = signal<number[]>([]);
  counts = signal<number[]>([0, 0, 0, 0]);
  openFaq = signal<number | null>(0);

  // Anul de la care numărăm experiența (personalitate juridică); anii se calculează singuri.
  private readonly startYear = 1997;

  // Valoarea pentru membri este fictivă: se înlocuiește cu cea reală.
  stats: Stat[] = [
    { value: new Date().getFullYear() - this.startYear, suffix: '+', label: 'Ani de experiență' },
    { value: 2000, suffix: '+', label: 'Membri' },
    { value: 2, suffix: '', label: 'Tipuri de împrumut' },
    { value: 5, suffix: '%', label: 'Dobândă aprox. la Fondul Social' }
  ];

  services: Service[] = [
    {
      number: '01',
      title: 'Împrumuturi tradiționale',
      tagline: 'Pentru nevoi personale și familiale',
      description:
        'O soluție de sprijin financiar pentru membrii care au nevoie de fonduri pentru diverse cheltuieli personale sau familiale, în spiritul întrajutorării și al sprijinului reciproc.',
      benefits: [
        'Suma maximă acordată: 50.000 lei',
        'Perioada maximă de rambursare: 60 de luni',
        'Dobândă nominală anuală fixă: 9,5%',
        'Posibilitatea de a-ți planifica rambursarea în funcție de posibilități'
      ],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      image: 'imprumut2.jpg',
      imagePosition: 'center'
    },
    {
      number: '02',
      title: 'Împrumuturi diversificate',
      tagline: 'Flexibilitate în alegerea soluției',
      description:
        'Destinate membrilor care au nevoie de soluții de finanțare pe termen scurt, mediu sau lung, în funcție de nevoile și posibilitățile acestora.',
      benefits: [
        'Suma maximă acordată: 70.000 lei',
        'Perioada maximă de rambursare: 60 de luni',
        'Dobândă nominală anuală fixă: 11,5%',
        'Condiții de acordare stabilite de asociație'
      ],
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      image: 'imprumut3.jpg',
      imagePosition: 'center'
    },
    {
      number: '03',
      title: 'Fondul Social',
      tagline: 'Economii cu dobândă',
      description:
        'Fondul Social reprezintă o componentă importantă a activității de întrajutorare desfășurate de asociație. Prin acest mecanism, membrii își pot constitui economii și pot beneficia de avantajele participării la activitatea asociației.',
      benefits: [
        'Dobândă de aproximativ 5% pentru sumele depuse',
        'Condiții stabilite prin regulamentele proprii',
        'Posibilitatea de a-ți constitui economii',
        'Participare la activitatea asociației, conform prevederilor aplicabile'
      ],
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      image: 'fondsocial.jpg',
      imagePosition: 'center'
    }
  ];

  faqs: Faq[] = [
    {
      question: 'Cine poate solicita un împrumut?',
      answer: 'Împrumuturile sunt destinate membrilor asociației, în condițiile prevăzute de statut și de regulamentele interne.'
    },
    {
      question: 'Dobânda este fixă sau variabilă?',
      answer: 'Dobânda este fixă, conform condițiilor de acordare stabilite de asociație: 9,5% pe an la împrumuturile tradiționale și 11,5% pe an la cele diversificate.'
    },
    {
      question: 'De câți giranți am nevoie?',
      answer: 'În funcție de suma solicitată, poate fi necesar unul, doi sau trei giranți. Numărul exact și condițiile le afli la sediul nostru.'
    },
    {
      question: 'Ce este Fondul Social?',
      answer: 'Este o componentă importantă a activității de întrajutorare. Pentru sumele depuse, asociația acordă o dobândă de aproximativ 5%, în condițiile stabilite prin regulamentele proprii.'
    },
    {
      question: 'Ce documente trebuie să pregătesc?',
      answer: 'Lista completă o găsești în pagina de Documente, împărțită pe categorii. Dacă ai nelămuriri, echipa noastră te poate ajuta să le pregătești.'
    }
  ];

  constructor() {
    afterNextRender(() => {
      const options: IntersectionObserverInit = {
        threshold: 0,
        rootMargin: '0px 0px -80px 0px'
      };

      this.observeOnce(this.statsRef.nativeElement, options, () => {
        this.statsVisible.set(true);
        this.startCounting();
      });
      this.observeOnce(this.faqRef.nativeElement, options, () => this.faqVisible.set(true));
      this.observeOnce(this.ctaRef.nativeElement, options, () => this.ctaVisible.set(true));
      this.observeOnce(this.infoRef.nativeElement, options, () => this.infoVisible.set(true));

      const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset['index']);
            this.visibleServices.update((list) => (list.includes(index) ? list : [...list, index]));
            serviceObserver.unobserve(entry.target);
          }
        });
      }, options);

      this.serviceBlocks.forEach((block) => serviceObserver.observe(block.nativeElement));
    });
  }

  toggleFaq(index: number) {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  format(value: number): string {
    return value.toLocaleString('ro-RO');
  }

  private startCounting() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.counts.set(this.stats.map((s) => s.value));
      return;
    }

    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.counts.set(this.stats.map((s) => Math.round(s.value * eased)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  private observeOnce(element: HTMLElement, options: IntersectionObserverInit, onVisible: () => void) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        onVisible();
        observer.disconnect();
      }
    }, options);
    observer.observe(element);
  }
}