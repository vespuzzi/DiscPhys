import { Component } from '@angular/core';
import { defaultSimulationSetup, Simulation } from 'src/model/Simulator';
import { SimulationChartComponent } from './simulation-chart/simulation-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Disc Physics Simulator 0.3';
  simulationSetup: any = defaultSimulationSetup;
  simulationSetupKeys = Object.keys(defaultSimulationSetup);
  ngOnInit(): void{
    //Simulation.simulate(this.simulationSetup);
  }

  updateSimulationInitialConditions = (simulationChart: SimulationChartComponent, event: any, prop: string) =>{
    this.simulationSetup[prop].value = event.value;
    this.simulationSetup.discMassRadius.max = this.simulationSetup.discDiameter/2;
    simulationChart.simulate(this.simulationSetup);
    return "ok";
  }
}
