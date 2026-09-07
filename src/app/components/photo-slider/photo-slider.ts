import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild, afterNextRender, output } from '@angular/core';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-photo-slider',
  standalone: true,
  templateUrl: './photo-slider.html',
  styleUrl: './photo-slider.css'
})
export class PhotoSlider implements OnInit, OnDestroy {
  @ViewChild('heroRef') heroRef!: ElementRef<HTMLElement>;

  sectionGone = output<boolean>();

  slides: Slide[] = [
    {
      image: 'slide-economii.jpg',
      title: 'Economisește inteligent, crește constant',
      subtitle: 'Depuneri sigure cu randamente avantajoase pentru viitorul tău'
    },
    {
      image: 'slide-imprumuturi.jpg',
      title: 'Împrumuturi avantajoase, adaptate ție',
      subtitle: 'Dobânzi competitive și condiții flexibile de rambursare'
    },
    {
      image: 'slide-comunitate.jpg',
      title: 'O comunitate mare, o familie unită',
      subtitle: 'Peste 500 de clienți mulțumiți în toată țara'
    }
  ];

  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const goneUp = entry.boundingClientRect.bottom <= 0;
            this.sectionGone.emit(entry.intersectionRatio === 0 && goneUp);
          });
        },
        { threshold: [0] }
      );
      observer.observe(this.heroRef.nativeElement);
    });
  }

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.intervalId = setInterval(() => this.next(), 5000);
  }

  stopAutoplay() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.slides.length);
  }

  prev() {
    this.currentIndex.set(
      (this.currentIndex() - 1 + this.slides.length) % this.slides.length
    );
  }

  goTo(index: number) {
    this.currentIndex.set(index);
    this.stopAutoplay();
    this.startAutoplay();
  }
}