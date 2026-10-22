import { Component, ElementRef, QueryList, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DataRow {
  data: string;
  purpose: string;
  basis: string;
  retention: string;
}

interface Right {
  title: string;
  text: string;
  icon: string;
}

interface Highlight {
  title: string;
  text: string;
  icon: string;
}

interface PrivacySection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
  table?: DataRow[];
  rights?: Right[];
}

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class PrivacyPage {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  activeId = signal<string>('');
  tocOpen = signal(false);

  readonly lastUpdated = '1 ianuarie 2026';

  readonly highlights: Highlight[] = [
    {
      title: 'Fără cookie-uri de urmărire',
      text: 'Site-ul nu folosește cookie-uri de analiză sau de publicitate.',
      icon: 'M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z M9 12l2 2 4-4'
    },
    {
      title: 'Doar datele necesare',
      text: 'Îți cerem doar ce ne trebuie pentru a-ți răspunde.',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      title: 'Nu vindem datele tale',
      text: 'Nu le vindem și nu le oferim spre folosire în scop comercial.',
      icon: 'M18.364 5.636l-12.728 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Tu ai controlul',
      text: 'Poți cere oricând accesul, corectarea sau ștergerea datelor.',
      icon: 'M5 13l4 4L19 7'
    }
  ];

  readonly sections: PrivacySection[] = [
    {
      id: 'operator',
      title: 'Cine prelucrează datele tale',
      paragraphs: [
        'Operatorul datelor este Cooperativa de Credit „Exemplu", cu sediul în Str. Exemplului nr. 1, Orașul Exemplu, Județul Exemplu, cod unic de înregistrare RO 00000000.',
        'Pentru orice întrebare despre datele tale ne poți scrie la confidentialitate@exemplu-cooperativa.ro.'
      ]
    },
    {
      id: 'date',
      title: 'Ce date colectăm și de ce',
      paragraphs: ['Colectăm date doar în situațiile de mai jos. Navigarea pe site nu presupune transmiterea de date personale.'],
      table: [
        {
          data: 'Nume, email, telefon, mesaj',
          purpose: 'Răspundem la mesajul trimis prin formularul de contact',
          basis: 'Interesul tău și al nostru de a comunica',
          retention: '12 luni de la ultimul mesaj'
        },
        {
          data: 'Nume, text și nota recenziei',
          purpose: 'Publicăm recenzia pe site',
          basis: 'Consimțământul tău',
          retention: 'Până ceri retragerea'
        },
        {
          data: 'Adresa IP, data și pagina accesată',
          purpose: 'Securitatea și buna funcționare a site-ului',
          basis: 'Interesul legitim de a proteja site-ul',
          retention: '30 de zile'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookie-uri și tehnologii similare',
      paragraphs: [
        'Site-ul nu folosește cookie-uri și nu stochează informații în browserul tău pentru analiză, publicitate sau urmărire.',
        'Dacă vom introduce în viitor astfel de instrumente, vom cere mai întâi acordul tău și vom actualiza această pagină.'
      ]
    },
    {
      id: 'folosire',
      title: 'Cum folosim datele',
      paragraphs: ['Folosim datele doar pentru scopul pentru care le-ai transmis. Nu luăm decizii automate care să te afecteze și nu facem profilare.'],
      list: [
        'pentru a-ți răspunde la întrebări și solicitări',
        'pentru a publica recenziile pe care ai ales să le trimiți',
        'pentru a păstra securitatea site-ului',
        'pentru a respecta obligațiile legale ale Cooperativei'
      ]
    },
    {
      id: 'destinatari',
      title: 'Cui transmitem datele',
      paragraphs: [
        'Nu vindem datele tale. Le putem transmite doar furnizorilor care ne ajută să operăm site-ul (de exemplu, găzduirea și baza de date) și autorităților, atunci când legea ne obligă.',
        'Acești furnizori prelucrează datele numai pe baza instrucțiunilor noastre și în condiții de securitate adecvate.'
      ]
    },
    {
      id: 'pastrare',
      title: 'Cât păstrăm datele',
      paragraphs: [
        'Păstrăm datele doar cât este necesar scopului pentru care au fost colectate, conform perioadelor din tabelul de mai sus. După expirare, le ștergem sau le anonimizăm.'
      ]
    },
    {
      id: 'drepturi',
      title: 'Drepturile tale',
      paragraphs: ['Conform legislației privind protecția datelor, ai următoarele drepturi:'],
      rights: [
        { title: 'Acces', text: 'Poți afla ce date avem despre tine.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z' },
        { title: 'Rectificare', text: 'Poți cere corectarea datelor greșite.', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.4-9.4a2 2 0 112.8 2.8L11.8 15H9v-2.8l8.6-8.6z' },
        { title: 'Ștergere', text: 'Poți cere ștergerea datelor, când e cazul.', icon: 'M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16' },
        { title: 'Restricționare', text: 'Poți cere limitarea prelucrării.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { title: 'Portabilitate', text: 'Poți primi datele într-un format uzual.', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
        { title: 'Opoziție', text: 'Te poți opune prelucrării bazate pe interes legitim.', icon: 'M18.364 5.636l-12.728 12.728M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
      ]
    },
    {
      id: 'exercitare',
      title: 'Cum îți exerciți drepturile',
      paragraphs: [
        'Scrie-ne la confidentialitate@exemplu-cooperativa.ro sau vino la sediu. Îți răspundem în cel mult 30 de zile și, ca să te protejăm, putem cere o verificare a identității.',
        'Dacă consideri că drepturile ți-au fost încălcate, poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), www.dataprotection.ro.'
      ]
    },
    {
      id: 'securitate',
      title: 'Securitatea datelor',
      paragraphs: [
        'Folosim măsuri tehnice și organizatorice adecvate: conexiune criptată (HTTPS), acces limitat la date și actualizarea regulată a sistemelor. Nicio metodă de transmitere pe internet nu este însă complet lipsită de risc.'
      ]
    },
    {
      id: 'modificari',
      title: 'Modificări ale politicii',
      paragraphs: [
        'Putem actualiza această politică. Versiunea în vigoare este cea de pe această pagină, cu data ultimei actualizări în partea de sus. Pentru schimbări importante te vom informa prin site.'
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