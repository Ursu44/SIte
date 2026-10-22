import { Component, ElementRef, QueryList, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TermsSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-page.html',
  styleUrl: './terms-page.css'
})
export class TermsPage {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  activeId = signal<string>('');
  tocOpen = signal(false);

  // Date fictive, de înlocuit după discuția cu cooperativa.
  readonly lastUpdated = '1 ianuarie 2026';

  readonly sections: TermsSection[] = [
    {
      id: 'introducere',
      title: 'Introducere și acceptare',
      paragraphs: [
        'Acest site este administrat de Cooperativa de Credit „Exemplu" (denumită în continuare „Cooperativa"). Prin accesarea și utilizarea site-ului, confirmi că ai citit și ai înțeles prezentii termeni și condiții.',
        'Dacă nu ești de acord cu o parte dintre ei, te rugăm să nu folosești site-ul. Utilizarea lui în continuare după o modificare a termenilor înseamnă că ai luat act de varianta actualizată.'
      ]
    },
    {
      id: 'operator',
      title: 'Date despre operator',
      paragraphs: ['Informațiile de identificare ale Cooperativei sunt următoarele:'],
      list: [
        'Denumire: Cooperativa de Credit „Exemplu"',
        'Cod unic de înregistrare: RO 00000000',
        'Registrul de evidență: C00/000/0000',
        'Sediu: Str. Exemplului nr. 1, Orașul Exemplu, Județul Exemplu',
        'Email: contact@exemplu-cooperativa.ro',
        'Telefon: 0200 000 000'
      ]
    },
    {
      id: 'scop',
      title: 'Scopul site-ului',
      paragraphs: [
        'Site-ul are rol informativ. Îți prezintă serviciile Cooperativei, documentele necesare și modul de contact. Informațiile nu reprezintă o ofertă fermă și nu produc efecte juridice între tine și Cooperativă.',
        'Un contract se încheie doar în scris, la sediul Cooperativei sau prin alte mijloace stabilite de comun acord, după analiza solicitării tale.'
      ]
    },
    {
      id: 'calculatoare',
      title: 'Calculatoare și simulări',
      paragraphs: [
        'Calculatoarele de împrumut și de economii oferă rezultate orientative, bazate pe valorile introduse de tine și pe ipoteze simplificate. Ele nu iau în calcul toate costurile sau situațiile individuale.',
        'Condițiile finale, inclusiv dobânda, comisioanele și rata, se stabilesc doar la încheierea contractului și pot diferi de simulare.'
      ]
    },
    {
      id: 'utilizare',
      title: 'Utilizarea permisă',
      paragraphs: ['Te angajezi să folosești site-ul în mod legal și cu bună-credință. Este interzis:'],
      list: [
        'să încerci accesul neautorizat la sistemele sau la datele Cooperativei',
        'să trimiți conținut fals, ofensator sau care încalcă drepturile altora',
        'să folosești programe automate pentru a prelua conținutul fără acordul nostru',
        'să perturbi funcționarea site-ului'
      ]
    },
    {
      id: 'recenzii',
      title: 'Recenzii și mesaje trimise',
      paragraphs: [
        'Dacă lași o recenzie sau trimiți un mesaj prin formularul de contact, ești responsabil pentru conținutul lui. Recenziile trebuie să reflecte o experiență reală.',
        'Ne rezervăm dreptul de a nu publica sau de a retrage conținutul care încalcă acești termeni sau legea, precum limbaj jignitor, date personale ale altor persoane ori mesaje promoționale.'
      ]
    },
    {
      id: 'proprietate',
      title: 'Proprietate intelectuală',
      paragraphs: [
        'Textele, imaginile, siglele și designul site-ului aparțin Cooperativei sau sunt folosite cu acordul titularilor. Nu le poți copia, modifica sau distribui fără acordul nostru scris.',
        'Poți tipări sau salva paginile pentru uz personal, cu condiția să nu le modifici și să păstrezi menționarea sursei.'
      ]
    },
    {
      id: 'date',
      title: 'Date personale și cookie-uri',
      paragraphs: [
        'Datele personale pe care ni le transmiți sunt prelucrate conform legislației aplicabile privind protecția datelor. Detaliile despre scopuri, durată și drepturile tale se găsesc în Politica de confidențialitate.',
        'Site-ul poate folosi cookie-uri necesare funcționării. Poți controla cookie-urile din setările browserului.'
      ]
    },
    {
      id: 'raspundere',
      title: 'Limitarea răspunderii',
      paragraphs: [
        'Depunem eforturi pentru ca informațiile să fie corecte și actualizate, dar nu garantăm lipsa erorilor sau disponibilitatea neîntreruptă a site-ului.',
        'Cooperativa nu răspunde pentru pagubele rezultate din utilizarea informațiilor de pe site fără verificarea lor în prealabil, din întreruperi tehnice sau din conținutul site-urilor externe către care trimitem.'
      ]
    },
    {
      id: 'modificari',
      title: 'Modificarea termenilor',
      paragraphs: [
        'Putem actualiza acești termeni oricând. Versiunea în vigoare este cea publicată pe această pagină, iar data ultimei actualizări apare la începutul ei.'
      ]
    },
    {
      id: 'legea',
      title: 'Legea aplicabilă și contact',
      paragraphs: [
        'Acești termeni sunt guvernați de legea română. Eventualele neînțelegeri se rezolvă pe cale amiabilă, iar în caz contrar de instanțele competente.',
        'Pentru orice întrebare despre acești termeni ne poți scrie la contact@exemplu-cooperativa.ro sau ne poți vizita la sediu.'
      ]
    }
  ];

  constructor() {
    afterNextRender(() => {
      const first = this.sections[0]?.id;
      if (first) this.activeId.set(first);

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (visible) this.activeId.set((visible.target as HTMLElement).id);
        },
        { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
      );
      this.sectionRefs.forEach((s) => observer.observe(s.nativeElement));
    });
  }

  toggleToc() {
    this.tocOpen.update((v) => !v);
  }

  goTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    this.activeId.set(id);
    this.tocOpen.set(false);
  }

  print() {
    window.print();
  }
}