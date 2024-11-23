import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pacient } from '../../interfaces/data.interface';

@Component({
  selector: 'pacient-card',
  imports: [],
  templateUrl: './pacientCard.component.html',
  styleUrl: './pacientCard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientCardComponent {
  info = input<Pacient>();
 }
