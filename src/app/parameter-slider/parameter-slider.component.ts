import { Component, OnInit, Input} from '@angular/core';
import { SimulationChartComponent } from '../simulation-chart/simulation-chart.component';

@Component({
  selector: 'parameter-slider',
  templateUrl: './parameter-slider.component.html',
  styleUrls: ['./parameter-slider.component.css']
})
export class ParameterSliderComponent implements OnInit {
  @Input() parameterName: any;
  @Input() prompt: string = "ADD PROMPT!!!";
  @Input() unit: string = "UNITS";
  @Input() simulationSetup: any ;
  @Input() simulationChart: any | undefined;
  @Input() min: any = 0;
  @Input() max: any = 10;
  @Input() step: any = 1;
  @Input() initialValue: number | undefined;
  @Input() tooltip = "Help";
  @Input() category = "discstate";
  @Input('onChange')
  onChange!: ((simulationChart: SimulationChartComponent, event: any, prop: string) => string); //callback function

  // change(simulationChart: SimulationChartComponent, event: any, prop: string) {
  //   if (this.onChange) this.onChange(simulationChart, event, prop)
  // }

  constructor() { }
  ngOnInit(): void {
      console.log("kukkuu");
  }

}
