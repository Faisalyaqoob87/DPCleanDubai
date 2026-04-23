import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css'
})
export class SiteHeaderComponent {
  @Input({ required: true }) itemCount = 0;
  @Output() cartClick = new EventEmitter<void>();
}
