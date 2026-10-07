import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Benefit {
  title: string;
  text: string;
  icon: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  needs: string[];
  time: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-membership-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './membership-page.html',
  styleUrl: './membership-page.css'
})
export class MembershipPage {
  @ViewChild('stepsRef') stepsRef!: ElementRef<HTMLElement>;
  // Toate elementele marcate cu #rv apar când ajung în ecran
  @ViewChildren('rv') revealTargets!: QueryList<ElementRef<HTMLElement>>;

  revealed = signal<string[]>([]);
  openFaq = signal<number | null>(0);

  benefits: Benefit[] = [
    { title: 'Sprijin financiar accesibil', text: 'Acces la soluții create pentru nevoile membrilor, cu condiții clare.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Transparență totală', text: 'Costurile și condițiile îți sunt prezentate înainte de orice decizie.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Echipă dedicată', text: 'Ai mereu cu cine vorbi, de la înscriere și pe tot parcursul colaborării.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'O comunitate unită', text: 'Faci parte dintr-un grup mare de oameni care se sprijină reciproc.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Proces simplu și rapid', text: 'Documentație redusă la minimum și răspunsuri în termene comunicate din start.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Acces la Zona membrii', text: 'Ai la dispoziție un spațiu dedicat, rezervat doar membrilor.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  steps: Step[] = [
    {
      number: '1',
      title: 'Ne contactezi',
      description: 'Ne suni, ne scrii sau treci pe la sediu. Îți explicăm pe scurt cum funcționează totul și răspundem la întrebările tale, fără nicio obligație.',
      needs: ['Un telefon, un email sau o vizită la sediu', 'Câteva minute pentru o discuție', 'Orice întrebare ai în minte'],
      time: 'Aprox. 10 minute'
    },
    {
      number: '2',
      title: 'Îți pregătești documentele',
      description: 'Primești lista exactă de documente, în funcție de categoria ta. Formularele le găsești gata de descărcat în pagina Documente.',
      needs: ['Actul de identitate', 'Cererea de înscriere completată', 'Documentele specifice categoriei tale'],
      time: 'Câteva zile'
    },
    {
      number: '3',
      title: 'Depui dosarul',
      description: 'Aduci documentele la sediu, iar un coleg le verifică împreună cu tine, ca să fii sigur că dosarul e complet de la prima depunere.',
      needs: ['Documentele pregătite la pasul anterior', 'Actul de identitate în original'],
      time: 'Aprox. 30 minute'
    },
    {
      number: '4',
      title: 'Analizăm dosarul',
      description: 'Echipa noastră verifică dosarul și îți comunică răspunsul în termenul stabilit. Dacă lipsește ceva, te anunțăm imediat și te ajutăm să completezi.',
      needs: ['Nimic suplimentar, doar disponibilitate la telefon', 'Eventual clarificări, dacă sunt necesare'],
      time: 'Conform termenului comunicat'
    },
    {
      number: '5',
      title: 'Devii membru',
      description: 'Semnezi documentele finale și ești oficial membru. Primești acces la Zona membrii și la toate serviciile comunității.',
      needs: ['Prezența pentru semnarea documentelor', 'Datele de contact actualizate'],
      time: 'Aceeași zi'
    }
  ];

  conditions: string[] = [
    'Să ai cel puțin vârsta minimă prevăzută în regulament',
    'Să faci parte din categoriile eligibile pentru înscriere',
    'Să prezinți un act de identitate valid',
    'Să completezi și să semnezi cererea de înscriere',
    'Să accepți regulamentul de funcționare'
  ];

  rights: string[] = [
    'Acces la toate serviciile oferite membrilor',
    'Informare clară și completă, în orice moment',
    'Sprijin din partea echipei dedicate',
    'Participare la deciziile comunității'
  ];

  duties: string[] = [
    'Respectarea regulamentului de funcționare',
    'Furnizarea de informații corecte și actualizate',
    'Îndeplinirea obligațiilor asumate la înscriere',
    'Comportament corect față de ceilalți membri'
  ];

  faqs: Faq[] = [
    { question: 'Cine poate deveni membru?', answer: 'Poate deveni membru orice persoană care îndeplinește condițiile de înscriere ale categoriei din care face parte. Dacă nu ești sigur, ne poți întreba, iar echipa noastră te îndrumă.' },
    { question: 'Cât durează procesul de înscriere?', answer: 'Durata depinde în principal de cât de repede îți pregătești documentele. Odată depus dosarul complet, îți comunicăm din start termenul în care primești răspunsul.' },
    { question: 'Trebuie să mă prezint personal?', answer: 'Pentru depunerea dosarului și semnarea documentelor este necesară prezența la sediu. Restul discuțiilor le putem purta și telefonic sau prin email.' },
    { question: 'Există taxe de înscriere?', answer: 'Toate contribuțiile și condițiile îți sunt prezentate transparent, înainte de semnare. Tu decizi dacă mergi mai departe.' },
    { question: 'Pot renunța la calitatea de membru?', answer: 'Da, conform regulamentului. Detaliile procedurii ți le explicăm la înscriere, ca să știi de la început cum funcționează.' }
  ];

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const key = (entry.target as HTMLElement).dataset['key'];
            if (!key) return;

            this.revealed.update((list) => (list.includes(key) ? list : [...list, key]));
            observer.unobserve(entry.target);
          });
        },
        // Funcționează și pentru elemente foarte înalte (mobil)
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );

      this.revealTargets.forEach((target) => observer.observe(target.nativeElement));
    });
  }

  isOn(key: string): boolean {
    return this.revealed().includes(key);
  }

  toggleFaq(index: number) {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  scrollToSteps() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.stepsRef.nativeElement.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}