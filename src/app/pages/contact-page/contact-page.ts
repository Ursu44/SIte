import { Component, signal, ElementRef, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage {
  @ViewChild('mapRef') mapRef!: ElementRef<HTMLElement>;

  animateIn = signal(false);
  mapVisible = signal(false);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.animateIn.set(true), 50);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.mapVisible.set(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(this.mapRef.nativeElement);
    });
  }
}