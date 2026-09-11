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
    {  title: 'Depunere de fonduri profitabile', description: 'Dobanzi foarte bune la depunerea de bani.' },
    {  title: 'Usurinta in accesarea serviciilor', description: 'Cu doar cateva conditii de indeplinit si completarea unor acte obtii rapid orice serviciu.' },
    {  title: 'O echipa dedicata', description: 'Personal bine pregatit gata pentru a oferi cele mai bune sfaturi financiare.' }
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