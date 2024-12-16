import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { alerts } from '../../../interfaces/alets.interface';

@Component({
  selector: 'alert-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertCardComponent {
  readonly alertInfo = input.required<alerts>();

  ngOnInit() {
    // Para acceder al valor del signal usamos ()
    console.log('Alert Info:', this.alertInfo());
  }
}
