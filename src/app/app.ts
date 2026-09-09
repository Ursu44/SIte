import { Component, signal } from '@angular/core';
import { TopBar } from './components/top-bar/top-bar';
import { Navbar } from './components/navbar/navbar';
import { PhotoSlider } from './components/photo-slider/photo-slider';
import { TextSection } from './components/text-section/text-section';
import { ListSection } from './components/list-section/list-section';
import { ServicesSection } from './components/services-section/services-section';
import { StepsSection } from './components/steps-section/steps-section';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopBar, Navbar, PhotoSlider, TextSection, ListSection, ServicesSection, StepsSection, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  heroRatio = signal(1);
  textRatio = signal(1);
  listSelfRatio = signal(1);
  servicesSelfRatio = signal(1);
}