import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pacient-analysis',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pacientAnalysis.component.html',
  styleUrl: './pacientAnalysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientAnalysisComponent { }
