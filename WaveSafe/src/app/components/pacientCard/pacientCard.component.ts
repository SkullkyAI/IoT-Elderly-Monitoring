import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pacient-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>pacientCard works!</p>`,
  styleUrl: './pacientCard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientCardComponent { }
