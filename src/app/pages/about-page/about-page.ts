import { Component, ElementRef, QueryList, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface Pillar {
  title: string;
  text: string;
  icon: string;
}

interface ValueItem {
  title: string;
  text: string;
  icon: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css'
})
export class AboutPage {
  @ViewChildren('rv') revealTargets!: QueryList<ElementRef<HTMLElement>>;

  revealed = signal<string[]>([]);
  counts = signal<number[]>([0, 0, 0, 0]);

  stats: Stat[] = [
    { value: 25, suffix: '+', label: 'Ani de experiență' },
    { value: 2000, suffix: '+', label: 'Membri' },
    { value: 5000, suffix: '+', label: 'Dosare finalizate' },
    { value: 100, suffix: '%', label: 'Transparență' }
  ];

  pillars: Pillar[] = [
    {
      title: 'Misiunea noastră',
      text: 'Să oferim soluții financiare accesibile, corecte și ușor de înțeles, sprijinind fiecare membru să își atingă obiectivele.',
      icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9'
    },
    {
      title: 'Viziunea noastră',
      text: 'Să fim alegerea de încredere pentru o comunitate mare și unită, în care fiecare om are acces la sprijin financiar echitabil.',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    }
  ];

  timeline: TimelineEvent[] = [
    { year: '2001', title: 'Începuturile', description: 'Pornim la drum cu un grup mic de oameni și o idee simplă: să ne ajutăm între noi.' },
    { year: '2006', title: 'Prima extindere', description: 'Comunitatea crește, iar serviciile noastre se diversifică pentru a răspunde mai multor nevoi.' },
    { year: '2012', title: 'Modernizarea serviciilor', description: 'Simplificăm procedurile și introducem instrumente noi, pentru un răspuns mai rapid.' },
    { year: '2018', title: 'Peste 1.000 de membri', description: 'Depășim pragul de o mie de membri și consolidăm echipa dedicată sprijinirii lor.' },
    { year: '2024', title: 'Un nou capitol', description: 'Ne deschidem către online, păstrând aceeași grijă și apropiere față de fiecare membru.' }
  ];

  values: ValueItem[] = [
    { title: 'Transparență', text: 'Costurile și condițiile îți sunt prezentate clar, înainte de orice decizie.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Seriozitate', text: 'Ne respectăm cuvântul și tratăm fiecare dosar cu responsabilitate.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Solidaritate', text: 'Credem în forța unei comunități care se sprijină reciproc.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Apropiere', text: 'Fiecare membru contează, iar echipa noastră îți este mereu aproape.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Eficiență', text: 'Procese simple și răspunsuri rapide, fără drumuri sau hârtii inutile.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Responsabilitate', text: 'Gestionăm cu grijă resursele comunității și răspundem pentru fiecare pas.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
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
            if (key === 'stats') this.startCounting();
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );

      this.revealTargets.forEach((target) => observer.observe(target.nativeElement));
    });
  }

  isOn(key: string): boolean {
    return this.revealed().includes(key);
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
}