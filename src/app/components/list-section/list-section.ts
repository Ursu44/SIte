import { Component, input, computed, afterNextRender, output, ViewChild, ElementRef } from '@angular/core';

interface NewsItem {
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

  textRatio = input<number>(1);
  listSelfRatio = output<number>();

  opacity = computed(() => {
    const r = this.textRatio();
    const value = (0.85 - r) / 0.1;
    return Math.min(1, Math.max(0, value));
  });

  newsItems: NewsItem[] = [
    {
      title: 'Dobândă fixă la împrumuturi',
      description: 'Împrumuturi cu dobândă fixă, de 9,5% la împrumut tradițional și 11,5% la împrumutul opționl, pe an, în funcție de tip, ca să știi din start ce ai de plătit.'
    },
    {
      title: 'Economii cu dobândă',
      description: 'Prin Fondul Social, sumele depuse primesc o dobândă de aproximativ 5%, în condițiile stabilite prin regulamentele asociației.'
    },
    {
      title: 'Rambursare pe măsura posibilităților',
      description: 'Îți poți planifica rambursarea în funcție de propriile posibilități, pe o perioadă de până la 60 de luni.'
    },
    {
      title: 'Spirit de întrajutorare',
      description: 'O comunitate bazată pe solidaritate, responsabilitate și sprijin reciproc, cu condiții transparente și încredere.'
    }
  ];

  constructor() {
    afterNextRender(() => {
      const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.listSelfRatio.emit(entry.intersectionRatio);
          });
        },
        { threshold: thresholds }
      );
      observer.observe(this.sectionRef.nativeElement);
    });
  }
}