import { Component } from '@angular/core';
import { DiscSetup, Simulation } from 'src/model/Simulator';
import { SimulationChartComponent } from './simulation-chart/simulation-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Disc Physics Simulator 0.1 Beta';
  discSetup: DiscSetup = {releaseHeight: 1.4, speed: 30, spin: 25, pitchAngle: 11, tilt: 0, initialAoA: 4};
  
  updateSimulationInitialConditions(simulationChart: SimulationChartComponent, event: any, prop: string){
    this.discSetup[prop] = event.value;
    simulationChart.simulate(this.discSetup);
  }
}
