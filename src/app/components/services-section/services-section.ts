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
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      title: 'Împrumuturi tradiționale',
      description: 'Până la 50.000 lei, rambursabili în cel mult 60 de luni, cu dobândă fixă de 9,5% pe an.'
    },
    {
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      title: 'Împrumuturi diversificate',
      description: 'Până la 70.000 lei, pe termen scurt, mediu sau lung, cu dobândă fixă de 11,5% pe an.'
    },
    {
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Fondul Social',
      description: 'Economii cu o dobândă de aproximativ 5%, în condițiile stabilite prin regulamentele asociației.'
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