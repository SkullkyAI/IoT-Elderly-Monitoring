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
      @defer (when onLoading()) {
      <div id="movement_plot"></div>
      <div id="falling_plot"></div>
      }@placeholder {
      <div class="loader"></div>
      }
      `,
  styleUrl: './pacientAnalysis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientAnalysisComponent implements OnInit {

  private ChSv = inject(ChartService);
  public data = input<Array<Array<number>>| undefined>();
  public data_bars = input<Array<number>| undefined>();
  public dates = input<Array<string> | undefined>();
  private _loadControl = signal<Array<boolean>>([false, false]);
  protected onLoading = linkedSignal(()=> (this._loadControl()[0] && this._loadControl()[1])?true:false);

  async ngOnInit() {
    this.ChSv.dates = this.dates()!;
    await Promise.all([
      this.ChSv.movementPlotGenerator(this.data()!, 'movement_plot'),
      this.ChSv.fallingPlotGenerator(this.data_bars()!, 'falling_plot')
    ]);
  }


}
