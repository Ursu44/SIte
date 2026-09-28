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
  @ViewChildren('serviceBlock') serviceBlocks!: QueryList<ElementRef<HTMLElement>>;

  statsVisible = signal(false);
  faqVisible = signal(false);
  ctaVisible = signal(false);
  visibleServices = signal<number[]>([]);
  counts = signal<number[]>([0, 0, 0, 0]);
  openFaq = signal<number | null>(0);

  stats: Stat[] = [
    { value: 25, suffix: '+', label: 'Ani de experiență' },
    { value: 2000, suffix: '+', label: 'Membri' },
    { value: 4, suffix: '', label: 'Servicii dedicate' },
    { value: 100, suffix: '%', label: 'Transparență' }
  ];

  services: Service[] = [
    {
      number: '01',
      title: 'Consultanță financiară',
      tagline: 'Decizii luate cu încredere',
      description:
        'Te ajutăm să înțelegi opțiunile pe care le ai și să alegi soluția potrivită situației tale. Analizăm împreună obiectivele tale și îți explicăm fiecare pas, fără termeni complicați.',
      benefits: [
        'Discuție personalizată, fără costuri ascunse',
        'Explicații clare pentru fiecare opțiune',
        'Plan adaptat nevoilor și posibilităților tale',
        'Îndrumare de la primul contact până la final'
      ],
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      image: 'serviciu-consultanta.jpg',
      imagePosition: 'center'
    },
    {
      number: '02',
      title: 'Procesare rapidă',
      tagline: 'Răspunsuri în timp record',
      description:
        'Știm că timpul contează. Documentația este simplificată, iar dosarul tău este preluat și procesat prompt, ca să afli rapid rezultatul solicitării.',
      benefits: [
        'Documentație simplificată la minimum necesar',
        'Termene de răspuns comunicate din start',
        'Urmărirea stadiului dosarului tău',
        'Fără drumuri inutile sau formalități în plus'
      ],
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      image: 'serviciu-procesare.jpg',
      imagePosition: 'center'
    },
    {
      number: '03',
      title: 'Analiză detaliată',
      tagline: 'Totul pus pe masă, clar',
      description:
        'Primești o imagine completă și ușor de înțeles asupra fiecărei etape. Rapoartele sunt clare, iar cifrele sunt prezentate transparent, ca să știi exact la ce te angajezi.',
      benefits: [
        'Rapoarte scrise, ușor de parcurs',
        'Costuri și condiții prezentate transparent',
        'Comparație între variantele disponibile',
        'Recomandări bazate pe situația ta reală'
      ],
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      image: 'serviciu-analiza.jpg',
      imagePosition: 'center'
    },
    {
      number: '04',
      title: 'Suport dedicat',
      tagline: 'Alături de tine, mereu',
      description:
        'O echipă atentă îți răspunde la întrebări și te sprijină pe tot parcursul colaborării, nu doar la început. Ai mereu cu cine vorbi când ai nevoie.',
      benefits: [
        'Persoană de contact dedicată dosarului tău',
        'Răspunsuri prin telefon, email sau la sediu',
        'Sprijin și după finalizarea solicitării',
        'Atitudine deschisă, fără presiune'
      ],
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      image: 'serviciu-suport.jpg',
      imagePosition: 'center'
    }
  ];

  faqs: Faq[] = [
    {
      question: 'Cum pot începe o solicitare?',
      answer: 'Ne poți contacta telefonic, prin email sau direct la sediu. Îți explicăm pașii și documentele de care ai nevoie, apoi te ghidăm în completarea dosarului.'
    },
    {
      question: 'Cât durează procesarea unui dosar?',
      answer: 'Termenul depinde de tipul solicitării și de completitudinea documentelor. Îți comunicăm din start un termen estimativ și te ținem la curent cu fiecare etapă.'
    },
    {
      question: 'Ce documente trebuie să pregătesc?',
      answer: 'Lista completă o găsești în pagina de Documente, împărțită pe categorii. Dacă ai nelămuriri, echipa noastră te poate ajuta să le pregătești.'
    },
    {
      question: 'Există costuri ascunse?',
      answer: 'Nu. Toate costurile și condițiile îți sunt prezentate transparent înainte de a lua o decizie, iar tu decizi dacă mergi mai departe.'
    },
    {
      question: 'Pot primi ajutor după finalizarea solicitării?',
      answer: 'Da, suportul nostru continuă și după finalizare. Poți reveni oricând cu întrebări, iar echipa îți răspunde cu plăcere.'
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