import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { range } from 'rxjs';
import { DiscProps } from 'src/model/Disc';
Chart.register(...registerables);


@Component({
  selector: 'app-coefficient-chart',
  templateUrl: './coefficient-chart.component.html',
  styleUrls: ['./coefficient-chart.component.css']
})
export class CoefficientChartComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    const discProps = new DiscProps();
    const data = discProps.cLiftData(-90, 90, 1);
   // const aChart = new Chart()

    const myChart = new Chart("coeffCanvas", {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Lift coefficient',
              data: data,
              borderWidth: 2,
              borderColor: 'blue',
              pointRadius: 0
          },
          {
            label: 'Drag coefficient',
            data: discProps.cDragData(-90, 90, 1),
            borderWidth: 2,
            borderColor: 'red',
            pointRadius: 0
          },
          {
          label: 'Pitching moment coefficient',
          data: discProps.cPitchingData(-90, 90, 1),
          borderWidth: 2,
          borderColor: 'green',
          pointRadius: 0
          }]
          
      },
      options:{
        responsive: true,
        showLine: true,
        scales: {
          x: {
            min: -90,
            max: 90
          }
        },
      }
  });
  }
   
  

}
