import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pacient } from '../../interfaces/data.interface';
// import { Base64ImagePipe } from '../../pipes/imageTransform.pipe';

@Component({
  selector: 'pacient-card',
  imports: [
    // Base64ImagePipe
  ],
  templateUrl: './pacientCard.component.html',
  styleUrl: './pacientCard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientCardComponent {
  info = input<Pacient>();
 }
