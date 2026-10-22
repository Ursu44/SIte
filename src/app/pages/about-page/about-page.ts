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

  private readonly startYear = 1997;

  stats: Stat[] = [
    { value: new Date().getFullYear() - this.startYear, suffix: '+', label: 'Ani de experiență' },
    { value: 2000, suffix: '+', label: 'Membri' },
    // { value: 1000, suffix: '+', label: 'Dosare finalizate' },
    { value: 100, suffix: '%', label: 'Transparență' }
  ];

  counts = signal<number[]>(this.stats.map(() => 0));

  pillars: Pillar[] = [
    {
      title: 'Misiunea noastră',
      text: 'Să fim alături de membrii noștri, promovând încrederea, respectul și spiritul de întrajutorare care ne-au definit încă de la începuturi.',
      icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9'
    },
    {
      title: 'Ce facem',
      text: 'Oferim sprijin financiar membrilor, prin acordarea de împrumuturi în condițiile stabilite prin statut și regulamentele interne, contribuind la gestionarea nevoilor financiare personale și familiale.',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  timeline: TimelineEvent[] = [
    { year: 'Originile', title: 'Dorința de întrajutorare', description: 'Asociația se naște din dorința de întrajutorare și sprijin reciproc a salariaților din cadrul Căilor Ferate Române, pe lângă instituția feroviară, în incinta gării.' },
    { year: 'Prima locație', title: 'Uzina de Impregnat Traverse', description: 'Activitatea își începe drumul în incinta Uzinei de Impregnat Traverse.' },
    { year: 'Sediul actual', title: 'Gara Burdujeni', description: 'Ulterior, sediul se mută în Gara Burdujeni din municipiul Suceava, unde asociația își continuă activitatea și în prezent.' },
    { year: '1997', title: 'Personalitate juridică', description: 'Asociația dobândește personalitate juridică, consolidându-și cadrul legal de organizare și funcționare.' },
    { year: 'Astăzi', title: 'Aceeași misiune', description: 'Ne continuăm misiunea de a fi alături de membrii noștri, cu încredere, respect și spirit de întrajutorare.' }
  ];

  values: ValueItem[] = [
    { title: 'Solidaritate', text: 'Credem în forța unei comunități care se sprijină reciproc.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Responsabilitate', text: 'Gestionăm cu grijă resursele comune și răspundem pentru fiecare pas.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { title: 'Întrajutorare', text: 'Fiecare membru contează, iar sprijinul vine din partea celorlalți.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Încredere', text: 'Construim relații bazate pe corectitudine și cuvânt respectat.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Respect', text: 'Ne tratăm membrii cu atenție, deschidere și respect.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Tradiție', text: 'Păstrăm principiile care au stat la baza înființării noastre.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
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