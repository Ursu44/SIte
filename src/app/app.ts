import { Component, signal } from '@angular/core';
import { TopBar } from './components/top-bar/top-bar';
import { Navbar } from './components/navbar/navbar';
import { PhotoSlider } from './components/photo-slider/photo-slider';
import { Footer } from './components/footer/footer';
import { TextSection } from './components/text-section/text-section';
import { ListSection } from './components/list-section/list-section';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopBar, Navbar, PhotoSlider, Footer,ListSection, TextSection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {  
  
  heroGone = signal(false);
  listGone = signal(false);
}