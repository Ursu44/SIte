import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface LoanType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  annualRate: number;      
  feePercent: number;      
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  amountPresets: number[];
  defaultAmount: number;
  minMonths: number;
  maxMonths: number;
  monthPresets: number[];
  defaultMonths: number;
  features: string[];
}

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface Advantage {
  title: string;
  text: string;
  icon: string;
}

interface HowStep {
  number: string;
  title: string;
  text: string;
}

interface Faq {
  question: string;
  answer: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round2 = (value: number) => Math.round(value * 100) / 100;

const needsDe = (n: number) => n >= 20 && (n % 100 === 0 || n % 100 >= 20);
const luniText = (n: number) => (n === 1 ? '1 lună' : needsDe(n) ? `${n} de luni` : `${n} luni`);
const aniText = (n: number) => (n === 1 ? '1 an' : needsDe(n) ? `${n} de ani` : `${n} ani`);

function durationText(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return luniText(months);
  if (rest === 0) return aniText(years);
  return `${aniText(years)} și ${luniText(rest)}`;
}

@Component({
  selector: 'app-loans-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './loans-page.html',
  styleUrl: './loans-page.css'
})
export class LoansPage {
  @ViewChild('calcRef') calcRef!: ElementRef<HTMLElement>;
  @ViewChild('stepsRef') stepsRef!: ElementRef<HTMLElement>;
  @ViewChildren('rv') revealTargets!: QueryList<ElementRef<HTMLElement>>;

  revealed = signal<string[]>([]);
  openFaq = signal<number | null>(0);
  showSchedule = signal(false);

  // Dobânzile, sumele maxime și perioadele maxime sunt cele comunicate de asociație.
  // Sumele minime, pașii și comisionul (feePercent: 0) sunt valori provizorii: se confirmă cu asociația.
  types: LoanType[] = [
    {
      id: 'traditional',
      name: 'Împrumuturi tradiționale',
      tagline: 'Pentru cheltuieli personale sau familiale',
      description: 'O soluție de sprijin financiar pentru membrii care au nevoie de fonduri pentru diverse cheltuieli personale sau familiale.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      annualRate: 9.5,
      feePercent: 0,
      minAmount: 1000,
      maxAmount: 50000,
      amountStep: 500,
      amountPresets: [5000, 10000, 25000, 50000],
      defaultAmount: 10000,
      minMonths: 6,
      maxMonths: 60,
      monthPresets: [12, 24, 36, 60],
      defaultMonths: 24,
      features: ['Suma maximă: 50.000 lei', 'Rambursare până la 60 de luni', 'Dobândă nominală anuală fixă: 9,5%']
    },
    {
      id: 'diversified',
      name: 'Împrumuturi diversificate',
      tagline: 'Flexibilitate în alegerea soluției',
      description: 'Pentru membrii care au nevoie de flexibilitate în alegerea soluției de finanțare, în funcție de suma solicitată și de perioada de rambursare.',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      annualRate: 11.5,
      feePercent: 0,
      minAmount: 1000,
      maxAmount: 70000,
      amountStep: 1000,
      amountPresets: [10000, 25000, 50000, 70000],
      defaultAmount: 20000,
      minMonths: 6,
      maxMonths: 60,
      monthPresets: [12, 24, 36, 60],
      defaultMonths: 24,
      features: ['Suma maximă: 70.000 lei', 'Termen scurt, mediu sau lung, până la 60 de luni', 'Dobândă nominală anuală fixă: 11,5%']
    }
  ];

  advantages: Advantage[] = [
    { title: 'Costuri clare', text: 'Dobânda și condițiile îți sunt prezentate înainte de semnare.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Rambursare planificată', text: 'Îți planifici rambursarea în funcție de propriile posibilități.', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { title: 'Reguli transparente', text: 'Împrumuturile se acordă conform statutului și regulamentelor interne.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Sprijin reciproc', text: 'Seriozitate și încredere, într-o relație durabilă cu membrii.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ];

  howSteps: HowStep[] = [
    { number: '1', title: 'Alegi și calculezi', text: 'Alegi tipul de împrumut, suma și perioada, apoi vezi rata în calculatorul de mai jos.' },
    { number: '2', title: 'Pregătești dosarul', text: 'Îți pregătești documentele din lista pentru categoria ta, gata de descărcat.' },
    { number: '3', title: 'Depui solicitarea', text: 'Aduci dosarul la sediu, iar un coleg îl verifică împreună cu tine.' },
    { number: '4', title: 'Primești răspunsul', text: 'Îți comunicăm decizia în termenul stabilit și, dacă e aprobat, semnezi și primești banii.' }
  ];

  faqs: Faq[] = [
    { question: 'Cum se calculează rata lunară?', answer: 'Calculatorul folosește rate egale (anuitate): fiecare rată conține o parte din capital și o parte din dobândă. Cu cât a trecut mai mult timp, cu atât partea de capital crește.' },
    { question: 'Ce este costul total al creditului?', answer: 'Este suma pe care o plătești în plus față de suma împrumutată: dobânda totală și comisionul de analiză, dacă există.' },
    { question: 'Rezultatul din calculator este oferta finală?', answer: 'Nu, calculatorul este orientativ. Oferta exactă o primești după analizarea dosarului tău, iar condițiile îți sunt prezentate înainte de semnare.' },
    { question: 'Pot alege o altă perioadă decât cele sugerate?', answer: 'Da, poți alege orice perioadă din limitele tipului de împrumut ales. Vezi cum se schimbă rata și alege varianta care ți se potrivește.' },
    { question: 'Cui se adresează împrumuturile?', answer: 'Împrumuturile sunt destinate membrilor Asociației, în condițiile prevăzute de statut și de regulamentele interne.' },
    { question: 'De câți giranți am nevoie?', answer: 'Împrumutul se acordă cu giranți, iar numărul lor (2, 3 sau 4) și veniturile acestora depind de suma solicitată. Detaliile le primești la sediul nostru.' },
    { question: 'Dobânda este fixă sau variabilă?', answer: 'Dobânda este fixă, conform condițiilor de acordare stabilite de asociație.' },
    { question: 'Care este diferența dintre cele două tipuri de împrumut?', answer: 'Împrumuturile tradiționale sunt pentru cheltuieli personale sau familiale (până la 50.000 lei, dobândă nominală de 9,5% pe an). Cele diversificate oferă mai multă flexibilitate în alegerea soluției de finanțare (până la 70.000 lei, dobândă nominală de 11,5% pe an). Ambele se pot rambursa pe până la 60 de luni.' },
    { question: 'Ce documente am nevoie?', answer: 'Lista completă, pe categorii, o găsești în pagina Documente, împreună cu formularele gata de descărcat.' }
  ];

  selectedId = signal(this.types[0].id);
  amountRaw = signal<number | null>(this.types[0].defaultAmount);
  monthsRaw = signal<number | null>(this.types[0].defaultMonths);

  selected = computed(() => this.types.find((t) => t.id === this.selectedId()) ?? this.types[0]);

  amount = computed(() => {
    const t = this.selected();
    const raw = this.amountRaw();
    return Math.round(clamp(raw !== null && Number.isFinite(raw) ? raw : t.minAmount, t.minAmount, t.maxAmount));
  });

  months = computed(() => {
    const t = this.selected();
    const raw = this.monthsRaw();
    return Math.round(clamp(raw !== null && Number.isFinite(raw) ? raw : t.minMonths, t.minMonths, t.maxMonths));
  });

  amountError = computed(() => {
    const t = this.selected();
    const raw = this.amountRaw();
    if (raw === null || !Number.isFinite(raw) || raw < t.minAmount || raw > t.maxAmount) {
      return `Alege o sumă între ${this.num(t.minAmount)} și ${this.num(t.maxAmount)} lei.`;
    }
    return null;
  });

  monthsError = computed(() => {
    const t = this.selected();
    const raw = this.monthsRaw();
    if (raw === null || !Number.isFinite(raw) || raw < t.minMonths || raw > t.maxMonths) {
      return `Alege o perioadă între ${t.minMonths} și ${luniText(t.maxMonths)}.`;
    }
    return null;
  });

  amountFill = computed(() => {
    const t = this.selected();
    return ((this.amount() - t.minAmount) / (t.maxAmount - t.minAmount)) * 100;
  });

  monthsFill = computed(() => {
    const t = this.selected();
    return ((this.months() - t.minMonths) / (t.maxMonths - t.minMonths)) * 100;
  });

  schedule = computed<ScheduleRow[]>(() => {
    const principal = this.amount();
    const n = this.months();
    const r = this.selected().annualRate / 1200;
    const monthly = round2(r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n)));

    const rows: ScheduleRow[] = [];
    let balance = principal;

    for (let month = 1; month <= n; month++) {
      const interest = round2(balance * r);
      const isLast = month === n;
      const principalPart = isLast ? balance : round2(monthly - interest);
      balance = isLast ? 0 : round2(balance - principalPart);
      rows.push({ month, payment: round2(principalPart + interest), principal: principalPart, interest, balance });
    }
    return rows;
  });

  result = computed(() => {
    const rows = this.schedule();
    const t = this.selected();
    const principal = this.amount();

    const total = round2(rows.reduce((sum, row) => sum + row.payment, 0));
    const interest = round2(total - principal);
    const fee = round2((principal * t.feePercent) / 100);
    const cost = round2(interest + fee);
    const grand = principal + interest + fee;
    const monthly = rows[0].payment;
    const last = rows[rows.length - 1].payment;

    return {
      monthly,
      last,
      lastDiffers: Math.abs(last - monthly) >= 0.01,
      total,
      interest,
      fee,
      cost,
      principalPct: (principal / grand) * 100,
      interestPct: (interest / grand) * 100,
      feePct: (fee / grand) * 100
    };
  });

  summary = computed(() => {
    const r = this.result();
    return `Rata lunară este de ${this.money(r.monthly)} lei, timp de ${durationText(this.months())}. Total de rambursat ${this.money(r.total)} lei. Costul total al creditului ${this.money(r.cost)} lei.`;
  });

  barLabel = computed(() => {
    const r = this.result();
    const fee = r.fee > 0 ? `, ${Math.round(r.feePct)}% comision` : '';
    return `Din totalul plătit: ${Math.round(r.principalPct)}% capital, ${Math.round(r.interestPct)}% dobândă${fee}`;
  });

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
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );

      this.revealTargets.forEach((target) => observer.observe(target.nativeElement));
    });
  }

  selectType(id: string) {
    this.selectedId.set(id);
    this.amountRaw.set(this.amount());
    this.monthsRaw.set(this.months());
  }

  chooseType(id: string) {
    this.selectType(id);
    this.scrollToCalc();
  }

  setAmount(value: number) {
    this.amountRaw.set(value);
  }

  changeAmount(direction: number) {
    const t = this.selected();
    this.amountRaw.set(clamp(this.amount() + direction * t.amountStep, t.minAmount, t.maxAmount));
  }

  onAmountInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.amountRaw.set(value === '' ? null : Number(value));
  }

  onAmountSlider(event: Event) {
    this.amountRaw.set(Number((event.target as HTMLInputElement).value));
  }

  commitAmount() {
    this.amountRaw.set(this.amount());
  }

  setMonths(value: number) {
    this.monthsRaw.set(value);
  }

  changeMonths(direction: number) {
    const t = this.selected();
    this.monthsRaw.set(clamp(this.months() + direction, t.minMonths, t.maxMonths));
  }

  onMonthsInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.monthsRaw.set(value === '' ? null : Number(value));
  }

  onMonthsSlider(event: Event) {
    this.monthsRaw.set(Number((event.target as HTMLInputElement).value));
  }

  commitMonths() {
    this.monthsRaw.set(this.months());
  }

  toggleFaq(index: number) {
    this.openFaq.update((current) => (current === index ? null : index));
  }

  isOn(key: string): boolean {
    return this.revealed().includes(key);
  }

  scrollToCalc() {
    this.scrollTo(this.calcRef.nativeElement);
  }

  scrollToSteps() {
    this.scrollTo(this.stepsRef.nativeElement);
  }

  private scrollTo(element: HTMLElement) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  // ===== Formatare pentru template =====
  money(value: number): string {
    return value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  num(value: number): string {
    return value.toLocaleString('ro-RO');
  }

  rate(value: number): string {
    return `${value.toLocaleString('ro-RO', { maximumFractionDigits: 2 })}%`;
  }

  luni(n: number): string {
    return luniText(n);
  }

  duration(months: number): string {
    return durationText(months);
  }
}