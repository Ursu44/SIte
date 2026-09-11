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
    { title: 'Dobanzi avantajoase', description: 'Oferim imprumutri cu dobanzi pentru orice buzunar.' },
    {  title: 'Depunere de fonduri', description: 'Am semnat un acord important care ne va permite să oferim servicii și mai complete.' },
    {  title: 'Usurinta in accesarea serviciilor', description: '' },
    {  title: 'Deschidem o nouă sucursală', description: 'Extindem prezența noastră pentru a fi mai aproape de comunitatea pe care o deservim.' }
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