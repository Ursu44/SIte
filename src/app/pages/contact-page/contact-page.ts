import { Component, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage {
  animateIn = signal(false);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.animateIn.set(true), 50);
    });
  }
}