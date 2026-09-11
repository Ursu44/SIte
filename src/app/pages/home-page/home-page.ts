import { Component, signal } from '@angular/core';
import { PhotoSlider } from '../../components/photo-slider/photo-slider';
import { TextSection } from '../../components/text-section/text-section';
import { ListSection } from '../../components/list-section/list-section';
import { ServicesSection } from '../../components/services-section/services-section';
import { StepsSection } from '../../components/steps-section/steps-section';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [PhotoSlider, TextSection, ListSection, ServicesSection, StepsSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  heroRatio = signal(1);
  textRatio = signal(1);
  listSelfRatio = signal(1);
  servicesSelfRatio = signal(1);
}