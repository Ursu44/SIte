import { Component, signal, input, effect } from '@angular/core';

@Component({
  selector: 'app-text-section',
  standalone: true,
  templateUrl: './text-section.html',
  styleUrl: './text-section.css'
})
export class TextSection {
  triggerVisible = input<boolean>(false);
  isVisible = signal(false);

  constructor() {
    effect(() => {
      this.isVisible.set(this.triggerVisible());
    });
  }
}