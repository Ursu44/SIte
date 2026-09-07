import { Component, ElementRef, ViewChild, afterNextRender, signal, input, output, effect } from '@angular/core';

interface NewsItem {
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-list-section',
  standalone: true,
  templateUrl: './list-section.html',
  styleUrl: './list-section.css'
})
export class ListSection {
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  heroGone = input<boolean>(false);
  isVisible = signal(false);
  animationDone = output<boolean>();

  newsItems: NewsItem[] = [
    { date: '28 August 2026', title: 'Lansăm un nou serviciu pentru clienți', description: 'Aflați cum vă putem ajuta mai bine cu cea mai nouă soluție dedicată nevoilor dumneavoastră.' },
    { date: '15 August 2026', title: 'Parteneriat strategic extins', description: 'Am semnat un acord important care ne va permite să oferim servicii și mai complete.' },
    { date: '2 August 2026', title: 'Certificare nouă obținută', description: 'Un pas important pentru garantarea calității serviciilor pe care le oferim clienților noștri.' },
    { date: '20 Iulie 2026', title: 'Deschidem o nouă sucursală', description: 'Extindem prezența noastră pentru a fi mai aproape de comunitatea pe care o deservim.' }
  ];

  constructor() {
    // Apare / dispare strict pe baza stării hero-ului (scroll)
    effect(() => {
      this.isVisible.set(this.heroGone());
      if (!this.heroGone()) {
        // dacă lista dispare, anunță imediat că și textul trebuie să dispară
        this.animationDone.emit(false);
      }
    });

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const goneUp = entry.boundingClientRect.bottom <= 0;
            const fullyGone = entry.intersectionRatio === 0 && goneUp;
            if (fullyGone) {
              this.animationDone.emit(true);
            }
          });
        },
        { threshold: [0] }
      );
      observer.observe(this.sectionRef.nativeElement);
    });
  }
}