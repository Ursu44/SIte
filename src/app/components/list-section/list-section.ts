import { Component, input, computed } from '@angular/core';

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
  textRatio = input<number>(1);

  opacity = computed(() => {
    const r = this.textRatio();
    const value = (0.85 - r) / 0.1;
    return Math.min(1, Math.max(0, value));
  });

  newsItems: NewsItem[] = [
    { date: '28 August 2026', title: 'Lansăm un nou serviciu pentru clienți', description: 'Aflați cum vă putem ajuta mai bine cu cea mai nouă soluție dedicată nevoilor dumneavoastră.' },
    { date: '15 August 2026', title: 'Parteneriat strategic extins', description: 'Am semnat un acord important care ne va permite să oferim servicii și mai complete.' },
    { date: '2 August 2026', title: 'Certificare nouă obținută', description: 'Un pas important pentru garantarea calității serviciilor pe care le oferim clienților noștri.' },
    { date: '20 Iulie 2026', title: 'Deschidem o nouă sucursală', description: 'Extindem prezența noastră pentru a fi mai aproape de comunitatea pe care o deservim.' }
  ];
}