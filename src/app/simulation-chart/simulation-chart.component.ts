import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DiscProps } from 'src/model/Disc';
import { initializeDiscState, Simulation, initializeEnvironment, defaultSimulationSetup } from 'src/model/Simulator';

@Component({ 
  selector: 'app-simulation-chart',
  templateUrl: './simulation-chart.component.html',
  styleUrls: ['./simulation-chart.component.css']
})
export class SimulationChartComponent implements OnInit {

  myChart: Chart | undefined; 
 
  ngOnInit(): void {
  this.myChart = new Chart("simulationCanvas", {
      type: 'scatter',
      data: {
          datasets: [{
                label: "Above view",
                data: [
                ],  
                borderWidth: 1.5,
                borderColor: 'blue',
                pointRadius: 0,
              },
              {
                label: "Side view",
                data: [
                ],  
                borderWidth: 1.5,
                borderColor: 'red',
                pointRadius: 0,
                }
              ]},
      options:{
        plugins: {
          legend: {
            display: true
          }
        },
        responsive: true,
        showLine: true,
        animation: false,
        scales: {
          x: {
            min: 0,
            max: 120
          },
          y: {
            min: -40,
            max: 40,
            // reverse: true
          }
        },
      }
  });
  this.simulate(defaultSimulationSetup);
};

simulate(setup: any) : void{

    const discState =  initializeDiscState(setup);
    const env = initializeEnvironment(setup) //new Environment(1.4, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(setup.discMass.value/1000, setup.discDiameter.value/100, setup.discMassRadius.value/100);
    const simulation = new Simulation(discProps, env);
    const result = simulation.simulate([discState]);

    if (this.myChart) {
      this.myChart.data.datasets[0].data =  result.map(state => {return {x: state.r.x, y:state.r.y}});
      this.myChart.data.datasets[1].data =  result.map(state => {return {x: state.r.x, y:state.r.z}});
    }
    this.myChart?.update();
    //console.log(this.myChart?.data.datasets[0]);
  }

}
