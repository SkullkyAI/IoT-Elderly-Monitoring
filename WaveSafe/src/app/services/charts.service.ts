import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType, scales } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';


@Injectable({
  providedIn: 'root'
})
export class ChartService {

  public dates: Array<string> = [];

  constructor() {
    Chart.register(BoxPlotController, BoxAndWiskers);
   }

  async movementPlotGenerator(box_data: Array<Array<number>>, name:string): Promise<boolean>{

    const data: ChartData<'boxplot'> = {
      labels: this.dates,
      datasets:[{
        label: name,

        data: box_data,
        backgroundColor: '#AFDFE0',
        borderWidth: 1,
      }]
    };
    const config: ChartConfiguration<'boxplot'> = {
      type: 'boxplot',
      data,
      options: {
        responsive: true,
        scales:{
          y:{
            beginAtZero: true
          }
        }
      }
    };

    const ctx = document.getElementById(name) as HTMLCanvasElement;
    const myBoxChart = new Chart(ctx, config);
    return true;
  }

  async fallingPlotGenerator(data: Array<number>, name:string): Promise<boolean>{
    const bar_data: ChartData<'bar'> = {
      labels: this.dates,
      datasets: [{
        label: 'Falling Data',
        data: data,
        type: 'bar'
      }]
    };

    const ctx = document.getElementById(name) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: bar_data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    return true;
  }
}
