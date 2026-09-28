import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, signal } from '@angular/core';

interface Category {
  id: string;
  label: string;
  title: string;
  description: string;
  conditions: string[];
  image: string;
  imagePosition?: string;
}

interface DocItem {
  title: string;
  description: string;
  file: string;
  size: string;
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  templateUrl: './documents-page.html',
  styleUrl: './documents-page.css'
})
export class DocumentsPage {
  @ViewChild('tabsRef') tabsRef!: ElementRef<HTMLElement>;
  @ViewChild('docsRef') docsRef!: ElementRef<HTMLElement>;
  @ViewChildren('docCard') docCards!: QueryList<ElementRef<HTMLElement>>;

  activeTab = signal(0);
  tabsVisible = signal(false);
  docsVisible = signal(false);
  visibleDocs = signal<number[]>([]);

  categories: Category[] = [
    {
      id: 'cat1',
      label: 'Categoria 1',
      title: 'Condiții pentru Categoria 1',
      description: 'Descriere scurtă a primei categorii și a cui i se adresează.',
      conditions: [
        'Prima condiție de îndeplinit pentru această categorie',
        'A doua condiție, formulată clar și pe scurt',
        'A treia condiție care trebuie respectată',
        'A patra condiție necesară pentru aprobare'
      ],
      image: 'categorie1.jpg',
      imagePosition: 'center'
    },
    {
      id: 'cat2',
      label: 'Categoria 2',
      title: 'Condiții pentru Categoria 2',
      description: 'Descriere scurtă a celei de-a doua categorii și a cui i se adresează.',
      conditions: [
        'Prima condiție pentru cea de-a doua categorie',
        'A doua condiție, adaptată acestei categorii',
        'A treia condiție care trebuie respectată',
        'A patra condiție necesară pentru aprobare'
      ],
      image: 'categorie2.jpg',
      imagePosition: 'center'
    }
  ];

  documents: DocItem[] = [
    { title: 'Cerere tip', description: 'Formularul standard de completat pentru orice solicitare.', file: 'documente/cerere-tip.pdf', size: 'PDF · 120 KB' },
    { title: 'Act de identitate', description: 'Model și indicații privind copia actului de identitate.', file: 'documente/act-identitate.pdf', size: 'PDF · 85 KB' },
    { title: 'Declarație pe propria răspundere', description: 'Model de declarație, gata de completat și semnat.', file: 'documente/declaratie.pdf', size: 'PDF · 96 KB' },
    { title: 'Acord de prelucrare a datelor', description: 'Acordul GDPR necesar pentru dosarul tău.', file: 'documente/acord-gdpr.pdf', size: 'PDF · 110 KB' },
    { title: 'Adeverință de venit', description: 'Model de adeverință care se solicită de la angajator.', file: 'documente/adeverinta-venit.pdf', size: 'PDF · 74 KB' },
    { title: 'Ghid complet', description: 'Toți pașii și documentele într-un singur ghid.', file: 'documente/ghid.pdf', size: 'PDF · 540 KB' }
  ];

  constructor() {
    afterNextRender(() => {
      const options: IntersectionObserverInit = {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px'
      };

      this.observeOnce(this.tabsRef.nativeElement, options, () => this.tabsVisible.set(true));
      this.observeOnce(this.docsRef.nativeElement, options, () => this.docsVisible.set(true));

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset['index']);
            this.visibleDocs.update((list) => (list.includes(index) ? list : [...list, index]));
            cardObserver.unobserve(entry.target);
          }
        });
      }, options);

      this.docCards.forEach((card) => cardObserver.observe(card.nativeElement));
    });
  }

  selectTab(index: number) {
    this.activeTab.set(index);
  }

  private observeOnce(element: HTMLElement, options: IntersectionObserverInit, onVisible: () => void) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        onVisible();
        observer.disconnect();
      }
    }, options);
    observer.observe(element);
  }
}