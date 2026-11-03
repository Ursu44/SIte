import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Category {
  id: string;
  label: string;
  title: string;
  description: string;
  conditions: string[];
  image: string;
  imageAlt: string;
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
  imports: [RouterLink],
  templateUrl: './documents-page.html',
  styleUrl: './documents-page.css'
})
export class DocumentsPage {
  @ViewChild('tabsRef') tabsRef!: ElementRef<HTMLElement>;
  @ViewChild('docsRef') docsRef!: ElementRef<HTMLElement>;
  @ViewChild('guarRef') guarRef!: ElementRef<HTMLElement>;
  @ViewChildren('docCard') docCards!: QueryList<ElementRef<HTMLElement>>;

  activeTab = signal(0);
  tabsVisible = signal(false);
  docsVisible = signal(false);
  guarVisible = signal(false);
  visibleDocs = signal<number[]>([]);

  categories: Category[] = [
    {
      id: 'salariati',
      label: 'Salariați',
      title: 'Documente pentru salariați',
      description: 'Pentru analizarea cererii de împrumut, salariații prezintă:',
      conditions: [
        'Adeverință de venit, completată de angajator',
        'Extras din Registrul general de evidență a salariaților (REGES-ONLINE), conform cerințelor asociației',
        'Actul de identitate și alte documente, dacă sunt solicitate'
      ],
      image: 'salariati.png',
      imageAlt: 'Salariați',
      imagePosition: 'center'
    },
    {
      id: 'pensionari',
      label: 'Pensionari',
      title: 'Documente pentru pensionari',
      description: 'Pentru analizarea cererii de împrumut, pensionarii prezintă:',
      conditions: [
        'Cuponul de pensie',
        'Actul de identitate',
        'Alte documente, în funcție de valoarea împrumutului solicitat'
      ],
      image: 'pensionari.png',
      imageAlt: 'pensionari.png',
      imagePosition: 'center'
    }
  ];

  guarantors = {
    title: 'Este nevoie de giranți?',
    paragraphs: [
      'În funcție de suma solicitată și de condițiile de acordare a împrumutului, poate fi necesară prezentarea unuia, a doi sau a trei giranți.',
      'Numărul giranților și documentele necesare se stabilesc în funcție de situația fiecărui solicitant. Pentru a afla ce documente sunt necesare în cazul tău, ce condiții trebuie îndeplinite și câți giranți sunt necesari pentru suma dorită, ne poți contacta sau ne poți vizita la sediul Casei de Ajutor Reciproc CFR Suceava.'
    ]
  };

  documents: DocItem[] = [
    { title: 'Cerere de înscriere', description: 'Formularul de completat pentru a deveni membru al asociației.', file: 'documente/CerereDeInscriere.pdf', size: 'PDF' },
    { title: 'Cerere de împrumut', description: 'Formularul de completat pentru solicitarea unui împrumut.', file: 'documente/CerereDeImprumut.pdf', size: 'PDF' },
    { title: 'Adeverință de imprumut', description: 'Model de adeverință care se completează de angajator.', file: 'documente/AdeverintaImprumut.pdf', size: 'PDF' },
    { title: 'Cerere de retragere', description: 'Formularul de completat pentru solicitarea retragereii unei sume de bani din fondul social.', file: 'documente/CerereDeRetragere.pdf', size: 'PDF' }
  ];

  constructor() {
    afterNextRender(() => {
      const options: IntersectionObserverInit = {
        threshold: 0,
        rootMargin: '0px 0px -60px 0px'
      };

      this.observeOnce(this.tabsRef.nativeElement, options, () => this.tabsVisible.set(true));
      this.observeOnce(this.docsRef.nativeElement, options, () => this.docsVisible.set(true));
      this.observeOnce(this.guarRef.nativeElement, options, () => this.guarVisible.set(true));

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