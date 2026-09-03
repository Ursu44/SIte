import { Component, signal, OnInit, OnDestroy } from '@angular/core';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './photo-slider.html',
  styleUrl: './photo-slider.css'
})
export class HeroSlider implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      image: 'https://picsum.photos/1600/900?random=1',
      title: 'Soluții profesionale pentru afacerea ta',
      subtitle: 'Experiență, încredere și rezultate de peste 10 ani'
    },
    {
      image: 'https://picsum.photos/1600/900?random=2',
      title: 'Echipă dedicată succesului tău',
      subtitle: 'Consultanță personalizată, adaptată nevoilor tale'
    },
    {
      image: 'https://picsum.photos/1600/900?random=3',
      title: 'Parteneri de încredere',
      subtitle: 'Peste 500 de clienți mulțumiți în toată țara'
    }
  ];

  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

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