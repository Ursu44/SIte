import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './coming-soon-page.html',
  styleUrl: './coming-soon-page.css'
})
export class ComingSoonPage {
  portalUrl: string | null = null;
}