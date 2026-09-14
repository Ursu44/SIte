import { afterNextRender, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from './components/top-bar/top-bar';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBar, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   @ViewChild('headerRef') headerRef!: ElementRef<HTMLElement>;

  constructor() {
    afterNextRender(() => {
      this.updateHeaderHeight();
      window.addEventListener('resize', () => this.updateHeaderHeight());
    });
  }

  updateHeaderHeight() {
    const height = this.headerRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  }
}