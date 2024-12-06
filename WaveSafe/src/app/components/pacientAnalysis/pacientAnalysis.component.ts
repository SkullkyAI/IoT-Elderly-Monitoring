import { ChangeDetectionStrategy, Component, input, linkedSignal, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../../services/charts.service';

@Component({
  selector: 'pacient-analysis',
  standalone: true,
  imports: [
  CommonModule,
  ],
  template: `
      <canvas id="movement_plot" width="400" height="250"></canvas>
      <canvas id="falling_plot" width="400" height="250"></canvas>
      `,
  styleUrl: './pacientAnalysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientAnalysisComponent implements OnInit {

  private ChSv = inject(ChartService);
  public lineData = input<Array<number>>();
  public data_bars = input<Array<boolean>>();
  public dates = input<Array<Date>>();
  private _loadControl = signal<Array<boolean>>([false, false]);
  protected onLoading = linkedSignal(()=> (this._loadControl()[0] && this._loadControl()[1])?true:false);

  async ngOnInit() {
    this._loadControl.set(await Promise.all([
      this.ChSv.movementPlotGenerator(this.lineData()!, this.dates()!, 'movement_plot'),
      this.ChSv.fallingPlotGenerator(this.data_bars()!, this.dates()!, 'falling_plot')
    ]));
  }
}
