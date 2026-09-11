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
    { number: '01', title: 'Obtinerea actelor', description: 'Documentele necesare se pot descarca din sectiunea Documente.' },
    { number: '02', title: 'Completarea documentelor ', description: 'Se completeaza documentele la sediul nostru.' },
    { number: '03', title: 'Gasirea si aducerea la sediu a girantilor', description: 'Dupa gasirea girantilor, trebuie sa va prezentati cu ei la sediu.' },
    { number: '04', title: 'Finalizarea', description: 'Dupa indeplinirea tuturor conditiilor si aprobare banii vor veni fie in cont fie prin casierie.' }
  ];
}