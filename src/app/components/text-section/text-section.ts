import { Component, ElementRef, ViewChild, afterNextRender, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-text-section',
  standalone: true,
  templateUrl: './text-section.html',
  styleUrl: './text-section.css'
})
export class TextSection {
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  heroRatio = input<number>(1);
  textRatio = output<number>();

  opacity = computed(() => {
    const r = this.heroRatio();
    const value = (0.6 - r) / 0.25;
    return Math.min(1, Math.max(0, value));
  });

  constructor() {
    afterNextRender(() => {
      const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.textRatio.emit(entry.intersectionRatio);
          });
        },
        { threshold: thresholds }
      );
      observer.observe(this.sectionRef.nativeElement);
    });
  }
}