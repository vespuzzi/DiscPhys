import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DiscProps, DiscState } from 'src/model/Disc';
import { SimulationSetup, Environment, getInitialDiscState, initializeDiscState, Simulation, initializeEnvironment } from 'src/model/Simulator';
import { Vector3 } from 'src/model/Vector3';

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
  this.simulate(new SimulationSetup);
};

simulate(setup: SimulationSetup) : void{

    const discState =  initializeDiscState(setup);
    const env = initializeEnvironment(setup) //new Environment(1.4, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(setup.discMass/1000, setup.discDiameter/100, setup.discMassRadius/100);
    const simulation = new Simulation(discProps, env);
    const result = simulation.simulate([discState]);

    // const mirsim  = new Simulation(discProps, env);
    // const mirsetup = {...discSetup, spin: -discSetup.spin};
    // const mirstate = initializeDiscState(mirsetup);
    // const mirror = mirsim.simulate([mirstate]); 

    //this.myChart?.data.datasets[0].data.push({x: this.count++, y: 70}); //= result.map(state => {return {x: state.r.x, y:state.r.y}});
    if (this.myChart) {
      this.myChart.data.datasets[0].data =  result.map(state => {return {x: state.r.x, y:state.r.y}});
      this.myChart.data.datasets[1].data =  result.map(state => {return {x: state.r.x, y:state.r.z}});
    }
    this.myChart?.update();
    //console.log(this.myChart?.data.datasets[0]);
  }

}
