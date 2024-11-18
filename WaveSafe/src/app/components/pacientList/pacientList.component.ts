import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pacient-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>pacientList works!</p>`,
  styleUrl: './pacientList.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientListComponent { }
