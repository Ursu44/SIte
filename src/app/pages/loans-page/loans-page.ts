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

  types: LoanType[] = [
    {
      id: 'personal',
      name: 'Nevoi personale',
      tagline: 'Pentru cheltuieli planificate',
      description: 'Un împrumut flexibil pentru cheltuieli personale, cu rate fixe pe care le știi din start.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      annualRate: 9.5,
      feePercent: 1,
      minAmount: 1000,
      maxAmount: 30000,
      amountStep: 500,
      amountPresets: [2000, 5000, 10000, 20000],
      defaultAmount: 5000,
      minMonths: 6,
      maxMonths: 60,
      monthPresets: [12, 24, 36, 48],
      defaultMonths: 24,
      features: ['Rate fixe, fără surprize', 'Perioadă de până la 5 ani', 'Documentație simplificată']
    },
    {
      id: 'urgent',
      name: 'Rapid',
      tagline: 'Pentru situații urgente',
      description: 'Sume mai mici, pe perioade scurte, cu procesare accelerată atunci când ai nevoie de bani repede.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      annualRate: 12,
      feePercent: 1.5,
      minAmount: 500,
      maxAmount: 5000,
      amountStep: 100,
      amountPresets: [1000, 2000, 3000, 5000],
      defaultAmount: 2000,
      minMonths: 3,
      maxMonths: 24,
      monthPresets: [6, 12, 18, 24],
      defaultMonths: 12,
      features: ['Procesare accelerată', 'Perioade scurte, rate mici', 'Răspuns în termen scurt']
    },
    {
      id: 'projects',
      name: 'Proiecte mari',
      tagline: 'Pentru planuri pe termen lung',
      description: 'Sume mai mari, pe perioade lungi, potrivite pentru investiții și proiecte importante.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      annualRate: 8,
      feePercent: 0.5,
      minAmount: 5000,
      maxAmount: 100000,
      amountStep: 1000,
      amountPresets: [10000, 25000, 50000, 100000],
      defaultAmount: 20000,
      minMonths: 12,
      maxMonths: 120,
      monthPresets: [24, 60, 84, 120],
      defaultMonths: 36,
      features: ['Perioadă de până la 10 ani', 'Dobândă mai mică', 'Consultanță dedicată']
    }
  ];

  advantages: Advantage[] = [
    { title: 'Costuri clare', text: 'Dobânda și comisioanele îți sunt prezentate înainte de semnare.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Rate stabile', text: 'Știi exact cât plătești în fiecare lună, pe toată perioada.', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { title: 'Termene comunicate', text: 'Afli din start în cât timp primești răspunsul la solicitare.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Sprijin la fiecare pas', text: 'Echipa noastră îți explică și te ghidează, fără presiune.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
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