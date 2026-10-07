import { Component, ElementRef, QueryList, ViewChild, ViewChildren, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type FieldKey = 'initial' | 'monthly' | 'months' | 'target';
type Mode = 'grow' | 'target';

interface Product {
  id: string;
  name: string;
  term: string;
  annualRate: number;   // dobândă anuală, în %
  minDeposit: number;
  minMonths: number;
  access: string;
  recommended: boolean;
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

  // ===== VALORI DE EXEMPLU: înlocuiește-le cu cele reale =====
  products: Product[] = [
    {
      id: 'flex',
      name: 'Economii flexibile',
      term: 'Fără termen fix',
      annualRate: 2.5,
      minDeposit: 100,
      minMonths: 1,
      access: 'Acces oricând',
      recommended: false,
      features: ['Depui când vrei', 'Fără termen fix', 'Începi cu o sumă mică']
    },
    {
      id: 'd12',
      name: 'Depozit 12 luni',
      term: '12 luni',
      annualRate: 4.5,
      minDeposit: 500,
      minMonths: 12,
      access: 'La scadență',
      recommended: true,
      features: ['Dobândă mai bună', 'Termen de un an', 'Echilibru între acces și randament']
    },
    {
      id: 'd36',
      name: 'Depozit 36 luni',
      term: '36 luni',
      annualRate: 6.5,
      minDeposit: 1000,
      minMonths: 36,
      access: 'La scadență',
      recommended: false,
      features: ['Cea mai mare dobândă', 'Pentru obiective pe termen lung', 'Creștere constantă']
    }
  ];

  goals: Goal[] = [
    { id: 'urgenta', name: 'Fond de urgență', text: 'O plasă de siguranță pentru momentele neprevăzute.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', target: 6000, initial: 500, months: 24 },
    { id: 'vacanta', name: 'Vacanță', text: 'Plecarea la care visezi, plătită fără griji.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', target: 5000, initial: 500, months: 12 },
    { id: 'masina', name: 'Mașină', text: 'Avansul sau suma întreagă pentru mașina dorită.', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', target: 25000, initial: 2000, months: 36 },
    { id: 'casa', name: 'Casă', text: 'Avansul pentru locuința ta, strâns pas cu pas.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', target: 60000, initial: 5000, months: 60 },
    { id: 'educatie', name: 'Educație', text: 'Studii, cursuri sau viitorul copiilor tăi.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', target: 15000, initial: 1000, months: 48 }
  ];

  howSteps: HowStep[] = [
    { number: '1', title: 'Alegi produsul', text: 'Compari variantele și o alegi pe cea potrivită obiectivului tău.' },
    { number: '2', title: 'Deschizi contul', text: 'Vii la sediu cu actele necesare, iar un coleg te ajută cu formalitățile.' },
    { number: '3', title: 'Faci prima depunere', text: 'Depui suma cu care începi, iar de aici economiile tale încep să crească.' },
    { number: '4', title: 'Urmărești cum crește', text: 'Poți adăuga oricând sume noi și vezi mereu cât ai strâns.' }
  ];

  infos: Info[] = [
    { title: 'Condiții clare', text: 'Dobânda, termenul și condițiile îți sunt prezentate înainte să alegi.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Control asupra economiilor', text: 'Știi mereu cât ai strâns și când ajungi la scadență.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Sprijin la fiecare pas', text: 'Echipa noastră îți răspunde la orice întrebare, fără presiune.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ];

  faqs: Faq[] = [
    { question: 'Cum se calculează dobânda?', answer: 'Calculatorul presupune dobândă capitalizată lunar, iar contribuțiile se depun la finalul fiecărei luni. Suma finală exactă se confirmă la deschiderea contului.' },
    { question: 'Pot depune bani și după ce deschid contul?', answer: 'Da, poți adăuga sume noi. Condițiile exacte depind de produsul ales, deci le discutăm la deschidere.' },
    { question: 'Ce se întâmplă la scadență?', answer: 'La scadență poți retrage suma împreună cu dobânda sau poți relua economisirea pentru o nouă perioadă.' },
    { question: 'Care este suma minimă cu care pot începe?', answer: 'Depinde de produs. Suma minimă pentru fiecare variantă o vezi în tabelul de comparație de mai sus.' },
    { question: 'Rezultatul din calculator este garantat?', answer: 'Nu, calculatorul este orientativ. Condițiile finale ți le prezentăm înainte de deschiderea contului.' }
  ];

  // Cifrele din banner, derivate din produse
  stats: Stat[] = [
    { value: Math.max(...this.products.map((p) => p.annualRate)), decimals: 1, suffix: '%', label: 'Dobândă anuală, până la' },
    { value: Math.min(...this.products.map((p) => p.minDeposit)), decimals: 0, suffix: ' lei', label: 'Depunere minimă' },
    { value: this.products.length, decimals: 0, suffix: '', label: 'Variante de economisire' }
  ];
  counts = signal<number[]>([0, 0, 0]);

  // Straturile care dau grosime monedei 3D
  coinLayers: number[] = Array.from({ length: 17 }, (_, i) => i - 8);

  // ===== Calculator =====
  fieldKeys: FieldKey[] = ['initial', 'monthly', 'months', 'target'];

  fieldMeta: Record<FieldKey, FieldMeta> = {
    initial: { label: 'Cu ce sumă începi?', short: 'suma inițială', suffix: 'lei', unit: 'lei', presets: [500, 1000, 5000, 10000] },
    monthly: { label: 'Cât economisești lunar?', short: 'contribuția lunară', suffix: 'lei / lună', unit: 'lei', presets: [0, 100, 250, 500, 1000] },
    months: { label: 'Pentru cât timp?', short: 'perioada', suffix: 'luni', unit: 'luni', presets: [12, 24, 36, 60] },
    target: { label: 'Ce sumă vrei să strângi?', short: 'suma țintă', suffix: 'lei', unit: 'lei', presets: [5000, 10000, 25000, 50000] }
  };

  mode = signal<Mode>('grow');
  selectedId = signal(this.products[1].id);
  raw = signal<Record<FieldKey, number | null>>({ initial: 1000, monthly: 200, months: 24, target: 10000 });

  selected = computed(() => this.products.find((p) => p.id === this.selectedId()) ?? this.products[0]);

  visibleFields = computed<FieldKey[]>(() =>
    this.mode() === 'grow' ? ['initial', 'monthly', 'months'] : ['target', 'initial', 'months']
  );

  limits = computed<Record<FieldKey, Limit>>(() => {
    const p = this.selected();
    return {
      initial: { min: p.minDeposit, max: 100000, step: 100 },
      monthly: { min: 0, max: 5000, step: 50 },
      months: { min: p.minMonths, max: 120, step: 1 },
      target: { min: 1000, max: 500000, step: 500 }
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

    if (this.mode() === 'target') {
      const growth = Math.pow(1 + r, n);
      const fromInitial = initial * growth;
      if (fromInitial >= v.target) {
        monthly = 0;
        alreadyThere = true;
      } else {
        const needed = r === 0 ? (v.target - initial) / n : ((v.target - fromInitial) * r) / (growth - 1);
        monthly = Math.ceil(needed * 100) / 100; // rotunjit în sus, ca să atingi ținta
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
      return `Cu suma inițială atingi deja ținta de ${this.num(v.target)} lei.`;
    }
    return `Trebuie să pui lunar ${this.money(c.monthly)} lei pentru a ajunge la ${this.num(v.target)} lei în ${durationText(v.months)}.`;
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