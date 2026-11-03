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
    {
      number: '01',
      title: 'Devino membru',
      description: 'Împrumuturile se acordă membrilor asociației. Completezi cererea de înscriere, achiți taxa de 30 lei și începi contribuția lunară la Fondul Social.'
    },
    {
      number: '02',
      title: 'Alege tipul de împrumut',
      description: 'Împrumut tradițional (până la 50.000 lei, dobândă fixă 9,5%) sau diversificat (până la 70.000 lei, dobândă fixă 11,5%), pe maximum 60 de luni.'
    },
    {
      number: '03',
      title: 'Pregătește documentele',
      description: 'Salariații au nevoie de adeverință de venit completată de angajator, extras REGES-ONLINE și act de identitate, iar pensionarii, de cupon de pensie și act de identitate. Formularele se descarcă din secțiunea Documente.'
    },
    {
      number: '04',
      title: 'Găsește giranții',
      description: 'În funcție de suma solicitată ai nevoie de unul, doi sau trei giranți. Vă prezentați împreună la sediu pentru completarea actelor.'
    },
    {
      number: '05',
      title: 'Aprobare și primirea banilor',
      description: 'După îndeplinirea condițiilor și aprobarea cererii, banii vin în cont sau îi ridici de la casierie.'
    }
  ];
}