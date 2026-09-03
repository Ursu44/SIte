import { Component } from '@angular/core';
import { TopBar } from './components/top-bar/top-bar';
import { Navbar } from './components/navbar/navbar';
import { HeroSlider } from './components/photo-slider/photo-slider';
import { NewsSection } from './components/news-section/news-section';
import { TextListSection } from './components/text-list-section/text-list-section';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopBar, Navbar, HeroSlider, NewsSection, TextListSection, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}