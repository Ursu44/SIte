import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type FieldKey = 'initial' | 'monthly' | 'months' | 'target';
type Mode = 'grow' | 'target';

interface Product {
  id: string;
  name: string;
  annualRate: number;   // dobândă anuală maximă, în %
  minMonthly: number;   // contribuția lunară minimă, în lei
  maxMonthly: number;   // contribuția lunară maximă, în lei
  joinFee: number;      // taxa de înscriere, în lei
  access: string;
  features: string[];
}

interface Goal {
  id: string;
  name: string;
  text: string;
  icon: string;
  target: number;
  initial: number;
  months: number;
}

interface Limit {
  min: number;
  max: number;
  step: number;
}

interface FieldMeta {
  label: string;
  short: string;
  suffix: string;
  unit: 'lei' | 'luni';
  presets: number[];
}

interface Row {
  month: number;
  balance: number;
  contributed: number;
}

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
}

interface HowStep {
  number: string;
  title: string;
  text: string;
}

interface Info {
  title: string;
  text: string;
  icon: string;
}

interface Faq {
  question: string;
  answer: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round2 = (value: number) => Math.round(value * 100) / 100;

// În română, numerele de la 20 în sus se leagă cu „de”: 24 de luni, 20 de ani
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

// Valoare „rotunjită frumos” pentru axa graficului
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 1.5, 2, 3, 4, 5, 6, 8, 10]) {
    if (step * magnitude >= value) return step * magnitude;
  }
  return 10 * magnitude;
}

@Component({
  selector: 'app-savings-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './savings-page.html',
  styleUrl: './savings-page.css'
})
export class SavingsPage {
  @ViewChild('calcRef') calcRef!: ElementRef<HTMLElement>;
  @ViewChild('productsRef') productsRef!: ElementRef<HTMLElement>;
  // Toate elementele marcate cu #rv apar când ajung în ecran
  @ViewChildren('rv') revealTargets!: QueryList<ElementRef<HTMLElement>>;

  revealed = signal<string[]>([]);
  openFaq = signal<number | null>(0);
  showTable = signal(false);

  // Dobânda (până la 5%), contribuția lunară (30–800 lei) și taxa de înscriere (30 lei) sunt cele comunicate de asociație.
  // Detaliile de retragere și modul exact de calcul al dobânzii se confirmă cu asociația (statut, regulamente).
  products: Product[] = [
    {
      id: 'fond-social',
      name: 'Fondul Social',
      annualRate: 5,
      minMonthly: 30,
      maxMonthly: 800,
      joinFee: 30,
      access: 'Conform statutului',
      features: [
        'Dobândă de până la 5% pe an, conform condițiilor asociației',
        'Depui lunar și îți construiești propriile economii',
        'Poți solicita retragerea sumelor, în condițiile prevăzute de statut',
        'Ca membru, poți solicita un împrumut'
      ]
    }
  ];

  goals: Goal[] = [
    { id: 'urgenta', name: 'Fond de urgență', text: 'O plasă de siguranță pentru momentele neprevăzute.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', target: 6000, initial: 0, months: 24 },
    { id: 'vacanta', name: 'Vacanță', text: 'Plecarea la care visezi, plătită fără griji.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', target: 5000, initial: 0, months: 18 },
    { id: 'masina', name: 'Mașină', text: 'Avansul sau suma întreagă pentru mașina dorită.', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', target: 25000, initial: 0, months: 48 },
    { id: 'educatie', name: 'Educație', text: 'Studii, cursuri sau viitorul copiilor tăi.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', target: 15000, initial: 0, months: 48 }
  ];

  howSteps: HowStep[] = [
    { number: '1', title: 'Completezi cererea', text: 'Completezi o cerere de înscriere ca membru al asociației, conform statutului.' },
    { number: '2', title: 'Achiți taxa de înscriere', text: 'Taxa de înscriere este de 30 lei, conform condițiilor asociației.' },
    { number: '3', title: 'Alegi contribuția lunară', text: 'Poți depune lunar o sumă între 30 și 800 lei, în funcție de posibilitățile tale.' },
    { number: '4', title: 'Economisești lunar', text: 'Depui contribuția aleasă, iar fondul tău social crește, cu dobândă de până la 5% pe an.' }
  ];

  infos: Info[] = [
    { title: 'Primești dobândă', text: 'Banii depuși în fondul social pot beneficia de dobândă, conform condițiilor stabilite de asociație.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { title: 'Economisești în ritmul tău', text: 'Poți contribui lunar la fondul social și îți poți dezvolta treptat economiile.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { title: 'Ai acces la fondul tău', text: 'Poți solicita retragerea sumelor în condițiile prevăzute de statut și de regulile asociației.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { title: 'Poți solicita un împrumut', text: 'În calitate de membru, poți solicita un împrumut, în funcție de fondul social și de condițiile de creditare aplicabile.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ];

  faqs: Faq[] = [
    { question: 'Cum se calculează dobânda?', answer: 'Calculatorul estimează o dobândă de până la 5% pe an, capitalizată lunar, cu depuneri la finalul fiecărei luni. Dobânda reală, condițiile și modalitatea de calcul se stabilesc conform regulilor în vigoare ale asociației.' },
    { question: 'Cât pot depune lunar?', answer: 'Poți depune lunar o sumă între 30 și 800 lei, în funcție de posibilitățile și obiectivele tale de economisire.' },
    { question: 'Cum pot deveni membru?', answer: 'Completezi o cerere de înscriere, achiți taxa de înscriere de 30 lei și îți stabilești contribuția lunară. Detaliile le găsești în pagina Devino membru.' },
    { question: 'Pot retrage banii din fondul social?', answer: 'Da, poți solicita retragerea sumelor în condițiile prevăzute de statut și de regulile asociației. Detaliile le primești la sediul nostru.' },
    { question: 'Pot obține un împrumut?', answer: 'Da, în calitate de membru poți solicita un împrumut, în funcție de fondul social și de condițiile de creditare aplicabile.' },
    { question: 'Rezultatul din calculator este garantat?', answer: 'Nu, calculatorul este orientativ. Dobânda este de până la 5% pe an, iar condițiile finale se stabilesc conform regulilor asociației.' }
  ];

  // Cifrele din banner, derivate din produse
  stats: Stat[] = [
    { value: Math.max(...this.products.map((p) => p.annualRate)), decimals: 0, suffix: '%', label: 'Dobândă anuală, până la' },
    { value: Math.min(...this.products.map((p) => p.minMonthly)), decimals: 0, suffix: ' lei', label: 'Contribuție lunară minimă' },
    { value: Math.max(...this.products.map((p) => p.maxMonthly)), decimals: 0, suffix: ' lei', label: 'Contribuție lunară maximă' }
  ];
  counts = signal<number[]>([0, 0, 0]);

  // Straturile care dau grosime monedei 3D
  coinLayers: number[] = Array.from({ length: 17 }, (_, i) => i - 8);

  // ===== Calculator =====
  fieldKeys: FieldKey[] = ['initial', 'monthly', 'months', 'target'];

  fieldMeta: Record<FieldKey, FieldMeta> = {
    initial: { label: 'Ce sumă ai deja în fond?', short: 'suma din fond', suffix: 'lei', unit: 'lei', presets: [0, 500, 1000, 5000] },
    monthly: { label: 'Cât depui lunar?', short: 'contribuția lunară', suffix: 'lei / lună', unit: 'lei', presets: [30, 100, 200, 400, 800] },
    months: { label: 'Pentru cât timp?', short: 'perioada', suffix: 'luni', unit: 'luni', presets: [12, 24, 36, 60] },
    target: { label: 'Ce sumă vrei să strângi?', short: 'suma țintă', suffix: 'lei', unit: 'lei', presets: [5000, 10000, 25000, 50000] }
  };

  mode = signal<Mode>('grow');
  selectedId = signal(this.products[0].id);
  raw = signal<Record<FieldKey, number | null>>({ initial: 0, monthly: 100, months: 24, target: 10000 });

  selected = computed(() => this.products.find((p) => p.id === this.selectedId()) ?? this.products[0]);

  visibleFields = computed<FieldKey[]>(() =>
    this.mode() === 'grow' ? ['initial', 'monthly', 'months'] : ['target', 'initial', 'months']
  );

  limits = computed<Record<FieldKey, Limit>>(() => {
    const p = this.selected();
    return {
      initial: { min: 0, max: 100000, step: 100 },
      monthly: { min: p.minMonthly, max: p.maxMonthly, step: 10 },
      months: { min: 1, max: 120, step: 1 },
      target: { min: 1000, max: 100000, step: 500 }
    };
  });

  // Valorile încadrate în limite, folosite în calcul
  values = computed<Record<FieldKey, number>>(() => {
    const raw = this.raw();
    const limits = this.limits();
    const out = {} as Record<FieldKey, number>;
    for (const key of this.fieldKeys) {
      const value = raw[key];
      const base = value !== null && Number.isFinite(value) ? value : limits[key].min;
      out[key] = Math.round(clamp(base, limits[key].min, limits[key].max));
    }
    return out;
  });

  halfMonths = computed(() => Math.round(this.values().months / 2));

  calc = computed(() => {
    const p = this.selected();
    const v = this.values();
    const n = v.months;
    const r = p.annualRate / 1200;
    const initial = v.initial;
    let monthly = v.monthly;
    let alreadyThere = false;
    let overMax = false;

    if (this.mode() === 'target') {
      const growth = Math.pow(1 + r, n);
      const fromInitial = initial * growth;
      const minMonthly = p.minMonthly;
      if (fromInitial >= v.target) {
        monthly = minMonthly; // contribuția minimă se plătește oricum
        alreadyThere = true;
      } else {
        const needed = r === 0 ? (v.target - initial) / n : ((v.target - fromInitial) * r) / (growth - 1);
        monthly = Math.max(minMonthly, Math.ceil(needed * 100) / 100); // rotunjit în sus, ca să atingi ținta
        overMax = monthly > p.maxMonthly;
      }
    }

    const rows: Row[] = [{ month: 0, balance: initial, contributed: initial }];
    let balance = initial;
    let contributed = initial;

    for (let month = 1; month <= n; month++) {
      balance = balance * (1 + r) + monthly; // dobânda se adaugă lunar, depunerea la final de lună
      contributed += monthly;
      rows.push({ month, balance: round2(balance), contributed: round2(contributed) });
    }

    const final = round2(balance);
    const paid = round2(contributed);
    const interest = round2(final - paid);

    return {
      monthly,
      alreadyThere,
      overMax,
      rows,
      final,
      paid,
      interest,
      paidPct: (paid / final) * 100,
      interestPct: (interest / final) * 100
    };
  });

  chart = computed(() => {
    const rows = this.calc().rows;
    const last = rows.length - 1;
    const max = niceMax(rows[last].balance);
    const x = (i: number) => (last === 0 ? 0 : (i / last) * 100);
    const y = (value: number) => 100 - (value / max) * 100;
    const line = (pick: (row: Row) => number) =>
      rows.map((row, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(pick(row)).toFixed(2)}`).join(' ');

    const balanceLine = line((row) => row.balance);
    const paidLine = line((row) => row.contributed);

    return {
      balanceLine,
      paidLine,
      balanceArea: `${balanceLine} L100,100 L0,100 Z`,
      paidArea: `${paidLine} L100,100 L0,100 Z`,
      ticks: [100, 75, 50, 25, 0].map((pct) => ({ pct, label: this.num(Math.round((max * pct) / 100)) }))
    };
  });

  yearRows = computed(() => {
    const rows = this.calc().rows;
    const last = rows[rows.length - 1].month;
    return rows.filter((row) => row.month > 0 && (row.month % 12 === 0 || row.month === last));
  });

  summary = computed(() => {
    const c = this.calc();
    const v = this.values();
    if (this.mode() === 'grow') {
      return `La final vei avea ${this.money(c.final)} lei, după ${durationText(v.months)}. Dobânda câștigată este de ${this.money(c.interest)} lei.`;
    }
    if (c.alreadyThere) {
      return `Cu suma din fond atingi deja ținta de ${this.num(v.target)} lei.`;
    }
    const over = c.overMax ? ' Contribuția maximă permisă este de 800 lei lunar.' : '';
    return `Trebuie să pui lunar ${this.money(c.monthly)} lei pentru a ajunge la ${this.num(v.target)} lei în ${durationText(v.months)}.${over}`;
  });

  chartLabel = computed(() => {
    const c = this.calc();
    const v = this.values();
    return `Grafic: suma ta crește de la ${this.num(v.initial)} lei la ${this.money(c.final)} lei în ${durationText(v.months)}. Depunerile tale totalizează ${this.money(c.paid)} lei.`;
  });

  barLabel = computed(() => {
    const c = this.calc();
    return `Din suma finală: ${Math.round(c.paidPct)}% depunerile tale, ${Math.round(c.interestPct)}% dobândă`;
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
            if (key === 'stats') this.startCounting();
            observer.unobserve(entry.target);
          });
        },
        // Funcționează și pentru elemente foarte înalte (mobil)
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );

      this.revealTargets.forEach((target) => observer.observe(target.nativeElement));
    });
  }

  // ===== Acțiuni calculator =====
  setMode(mode: Mode) {
    this.mode.set(mode);
  }

  selectProduct(id: string) {
    this.selectedId.set(id);
    // Valorile curente se încadrează automat în limitele noului produs
    this.raw.set({ ...this.values() });
  }

  chooseProduct(id: string) {
    this.selectProduct(id);
    this.scrollTo(this.calcRef.nativeElement);
  }

  chooseGoal(goal: Goal) {
    this.mode.set('target');
    this.raw.update((r) => ({ ...r, target: goal.target, initial: goal.initial, months: goal.months }));
    this.raw.set({ ...this.values() });
    this.scrollTo(this.calcRef.nativeElement);
  }

  setValue(key: FieldKey, value: number | null) {
    this.raw.update((r) => ({ ...r, [key]: value }));
  }

  changeBy(key: FieldKey, direction: number) {
    const limit = this.limits()[key];
    this.setValue(key, clamp(this.values()[key] + direction * limit.step, limit.min, limit.max));
  }

  onInput(key: FieldKey, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.setValue(key, value === '' ? null : Number(value));
  }

  commit(key: FieldKey) {
    this.setValue(key, this.values()[key]);
  }

  fill(key: FieldKey): number {
    const limit = this.limits()[key];
    return ((this.values()[key] - limit.min) / (limit.max - limit.min)) * 100;
  }

  presetsFor(key: FieldKey): number[] {
    const limit = this.limits()[key];
    return this.fieldMeta[key].presets.filter((p) => p >= limit.min && p <= limit.max);
  }

  error(key: FieldKey): string | null {
    const value = this.raw()[key];
    const limit = this.limits()[key];
    if (value === null || !Number.isFinite(value) || value < limit.min || value > limit.max) {
      return `Alege o valoare între ${this.fmt(key, limit.min)} și ${this.fmt(key, limit.max)}.`;
    }
    return null;
  }

  fmt(key: FieldKey, value: number): string {
    return this.fieldMeta[key].unit === 'luni' ? luniText(value) : `${this.num(value)} lei`;
  }

  interestOf(row: Row): number {
    return round2(row.balance - row.contributed);
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

  scrollToProducts() {
    this.scrollTo(this.productsRef.nativeElement);
  }

  private scrollTo(element: HTMLElement) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  private startCounting() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.counts.set(this.stats.map((s) => s.value));
      return;
    }

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.counts.set(this.stats.map((s) => Number((s.value * eased).toFixed(s.decimals))));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  // ===== Formatare pentru template =====
  statText(index: number): string {
    const stat = this.stats[index];
    const text = this.counts()[index].toLocaleString('ro-RO', {
      minimumFractionDigits: stat.decimals,
      maximumFractionDigits: stat.decimals
    });
    return text + stat.suffix;
  }

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