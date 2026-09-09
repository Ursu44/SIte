import { Component, input, computed, ViewChild, ElementRef, output, afterNextRender } from '@angular/core';

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  templateUrl: './services-section.html',
  styleUrl: './services-section.css'
})
export class ServicesSection {
  
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  listSelfRatio = input<number>(1);
  servicesSelfRatio = output<number>();

  opacity = computed(() => {
    const r = this.listSelfRatio();
    const value = (0.6 - r) / 0.3;
    return Math.min(1, Math.max(0, value));
  });

  services: ServiceItem[] = [
    {
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Consultanță financiară',
      description: 'Sfaturi personalizate pentru a lua cele mai bune decizii financiare.'
    },
    {
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      title: 'Procesare rapidă',
      description: 'Documentație simplificată și răspunsuri în timp record.'
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Analiză detaliată',
      description: 'Rapoarte clare, ușor de înțeles, pentru fiecare etapă a colaborării.'
    },
    {
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Suport dedicat',
      description: 'O echipă mereu disponibilă să răspundă întrebărilor tale.'
    }
  ];

  constructor() {
    afterNextRender(() => {
      const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.servicesSelfRatio.emit(entry.intersectionRatio);
          });
        },
        { threshold: thresholds }
      );
      observer.observe(this.sectionRef.nativeElement);
    });
  }
}