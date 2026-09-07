import { Component, ElementRef, ViewChild, afterNextRender, signal } from '@angular/core';

@Component({
  selector: 'app-text-list-section',
  standalone: true,
  templateUrl: './text-list-section.html',
  styleUrl: './text-list-section.css'
})
export class TextListSection {
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  isVisible = signal(false);

  benefits: string[] = [
    'Experiență de peste 10 ani în domeniu',
    'Echipă de specialiști certificați',
    'Suport dedicat 24/7',
    'Soluții personalizate pentru fiecare client',
    'Prețuri competitive și transparente'
  ];

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isVisible.set(entry.isIntersecting);
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(this.sectionRef.nativeElement);
    });
  }
}