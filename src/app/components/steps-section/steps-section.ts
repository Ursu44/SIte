import { Component, input, computed } from '@angular/core';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-steps-section',
  standalone: true,
  templateUrl: './steps-section.html',
  styleUrl: './steps-section.css'
})
export class StepsSection {
  servicesSelfRatio = input<number>(1);

  opacity = computed(() => {
    const r = this.servicesSelfRatio();
    const value = (0.8 - r) / 0.3;
    return Math.min(1, Math.max(0, value));
  });

  steps: Step[] = [
    { number: '01', title: 'Ne contactezi', description: 'Ne spui ce ai nevoie, printr-un telefon, email sau formular pe site.' },
    { number: '02', title: 'Analizăm situația', description: 'Echipa noastră evaluează cerințele tale și pregătește o soluție potrivită.' },
    { number: '03', title: 'Primești oferta', description: 'Îți prezentăm o propunere clară, fără costuri ascunse.' },
    { number: '04', title: 'Finalizăm împreună', description: 'Semnăm, implementăm, și rămânem alături de tine pe tot parcursul.' }
  ];
}