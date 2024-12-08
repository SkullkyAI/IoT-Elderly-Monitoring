import { Injectable } from '@angular/core';
import { BarElement, CategoryScale, Chart, ChartConfiguration, ChartData, ChartType, LinearScale, LineController, LineElement, PointElement} from 'chart.js';
import { BoxPlotController, BoxAndWiskers} from '@sgratzl/chartjs-chart-boxplot';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() {
    Chart.register(LinearScale, CategoryScale, BoxPlotController, BoxAndWiskers, BarElement, LineElement, PointElement, LineController);
   }

  async movementPlotGenerator(lineData: Array<number>, dates: Array<Date>, name:string): Promise<boolean>{
    
    const labels = Array.from({length: 24}, (_, index) => index);

    const data: ChartData<'line'> = {
      labels: labels,
      datasets:[{
        label: name,
        data: lineData.slice(-24),
        backgroundColor: '#AFDFE0',
        borderWidth: 1,
      }]
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales:{
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Hours',
            },
          },
          y:{
            beginAtZero: true,
            type: 'linear',
            title: {
              display: true,
              text: 'Minutes of Movement',
            }
          }
        },
      },
    };

    const ctx = document.getElementById(name) as HTMLCanvasElement;
    if (!ctx) {
      console.error(`Canvas element wth id ${name} not found`)
    }
    console.log(`${ctx}`)
    new Chart(ctx, config);


    return true;
  }

  async fallingPlotGenerator(data: Array<boolean>, dates: Array<Date>, name:string): Promise<boolean>{

    const groupSize = 1;
    const groupedSums = [];

    for (let i = 0; i < data.length; i += groupSize) {
      const chunk = data.slice(i, i + groupSize); // Take 24 elements
      const sum = chunk.reduce((acc, value) => acc + (value ? 1 : 0), 0); // Count `true` values
      groupedSums.push(sum); // Add the sum to the result
    }
    const labels = Array.from({length: 24}, (_, index) => index);

    const bar_data: ChartData<'bar'> = {
      labels: labels,
      datasets: [{
        label: 'Fall data',
        data: groupedSums,
        borderColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },]
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: bar_data,
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            type: 'category',
            title: {
              display: true,
              text: 'Hours',
            },
          },
          y: {
            display: true,
            type: 'linear',
            min: 0,
            max: 1,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: 'Fall data',
            }
          }
        },
      },
    };

    const ctx = document.getElementById(name) as HTMLCanvasElement;
    new Chart(ctx, config);

    return true;
  }
}
