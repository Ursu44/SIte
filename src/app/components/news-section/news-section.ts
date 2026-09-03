import { Component, ElementRef, ViewChild, afterNextRender, signal } from '@angular/core';

interface NewsItem {
  image: string;
  date: string;
  title: string;
  excerpt: string;
}

@Component({
  selector: 'app-news-section',
  standalone: true,
  templateUrl: './news-section.html',
  styleUrl: './news-section.css'
})
export class NewsSection {
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  isVisible = signal(false);

  news: NewsItem[] = [
    {
      image: 'https://picsum.photos/400/300?random=10',
      date: '28 August 2026',
      title: 'Lansăm un nou serviciu pentru clienți',
      excerpt: 'Aflați cum vă putem ajuta mai bine cu cea mai nouă soluție.'
    },
    {
      image: 'https://picsum.photos/400/300?random=11',
      date: '15 August 2026',
      title: 'Parteneriat strategic extins',
      excerpt: 'Am semnat un acord important pentru dezvoltarea afacerii.'
    },
    {
      image: 'https://picsum.photos/400/300?random=12',
      date: '2 August 2026',
      title: 'Certificare nouă obținută',
      excerpt: 'Un pas important pentru calitatea serviciilor noastre.'
    }
  ];

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isVisible.set(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(this.sectionRef.nativeElement);
    });
  }
}