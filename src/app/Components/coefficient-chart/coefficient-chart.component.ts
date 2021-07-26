import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


@Component({
  selector: 'app-coefficient-chart',
  templateUrl: './coefficient-chart.component.html',
  styleUrls: ['./coefficient-chart.component.css']
})
export class CoefficientChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // var ctx = document.getElementById('coeffChart');//document.getElementById('divChart').getContext('2d'); 
    var myChart = new Chart("coeffChart", {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Lift coefficient',
              data: [{x: -50, y: -0.9} , 
                     {x: -25, y: -0.4} ,
                     {x: -10, y: 0.05} ,
                     {x: 0, y: 0.2} ,
                     {x: 10, y: 0.35} ,
                     {x: 25, y: 1.4} ,
                     {x: 50, y: 2.6} ,
                    ],
              borderWidth: 5,
          }]
      },
      options:{
        showLine: true
      }
  });
  }

}
