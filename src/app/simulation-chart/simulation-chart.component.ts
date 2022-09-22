import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DiscProps } from 'src/model/Disc';
import { Environment, initialDiscSetup, Simulation } from 'src/model/Simulator';
import { Vector3 } from 'src/model/Vector3';

@Component({ 
  selector: 'app-simulation-chart',
  templateUrl: './simulation-chart.component.html',
  styleUrls: ['./simulation-chart.component.css']
})
export class SimulationChartComponent implements OnInit {

  myChart: Chart | undefined; 
  count = 1;

  constructor() {this.myChart = new Chart("simulationCanvas", {
    type: 'scatter',
    data: {
        datasets: [{
            label: "SIMUL",
            data: [
              {x: 5, y: 10},
              {x: 10, y: 10},
              {x: 15, y: 30},
              {x: 50, y: 33},
            ],  
            borderWidth: 2,
            borderColor: 'blue',
            pointRadius: 0
            }]},
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
}); }  

  ngOnInit(): void {
  this.myChart = new Chart("simulationCanvas", {
      type: 'scatter',
      data: {
          datasets: [{
              label: "SIMUL",
              data: [
                {x: 5, y: 10},
                {x: 10, y: 10},
                {x: 15, y: 30},
                {x: 50, y: 33},
              ],  
              borderWidth: 2,
              borderColor: 'blue',
              pointRadius: 0
              }]},
      options:{
        responsive: true,
        showLine: true,
        scales: {
          x: {
            min: 0,
            max: 120
          },
          y: {
            min: -40,
            max: 40
          }
        },
      }
  });
};

onSimulate(event?: MouseEvent) : void{
    
    const discState =  initialDiscSetup(1.18, 30, 25,     7, 20, 0); 
    const env = new Environment(1.4, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(0.180, 0.21, 0.09);
    const simulation = new Simulation(discProps, env);
    // console.log(simulation.updateDiscState(discState, 0.1));
    //const result = simulation.simulate([discState], (states) => states.length < 5);
    const result = simulation.simulate([discState]);
    console.log(result.map((state) => state.r.x).slice(-10), result.length);

    //this.myChart?.data.datasets[0].data.push({x: this.count++, y: 70}); //= result.map(state => {return {x: state.r.x, y:state.r.y}});
    if (this.myChart) {
      this.myChart.data.datasets[0].data =  result.map(state => {return {x: state.r.x, y:state.r.z}});
    }
    this.myChart?.update();

    console.log(this.myChart?.data.datasets[0]);

  }

}
