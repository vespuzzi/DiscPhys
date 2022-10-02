import { Component } from '@angular/core';
import { SimulationSetup, Simulation } from 'src/model/Simulator';
import { SimulationChartComponent } from './simulation-chart/simulation-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Disc Physics Simulator 0.1 Beta';
  simulationSetup: SimulationSetup = new SimulationSetup();
  
  ngOnInit(): void{
    //Simulation.simulate(this.simulationSetup);
  }

  updateSimulationInitialConditions(simulationChart: SimulationChartComponent, event: any, prop: string){
    this.simulationSetup[prop] = event.value;
    simulationChart.simulate(this.simulationSetup);
  }
}
