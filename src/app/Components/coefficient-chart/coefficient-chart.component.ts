import { Component, OnInit } from '@angular/core';
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
    var myChart = new Chart("coeffChart", {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Lift coefficient',
              data: data,
              borderWidth: 2,
              borderColor: 'blue',
          }]
      },
      options:{
        showLine: true
      }
  });
  }
   
  

}
