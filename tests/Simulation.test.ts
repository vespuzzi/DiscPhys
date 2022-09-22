import { DiscProps, DiscState } from "../src/model/Disc";
import { deg2Rad, Environment, initialDiscSetup, Simulation } from "../src/model/Simulator";
import { spherical, Vector3 } from "../src/model/Vector3";


test ('Simulation', () => {
    const discState =  initialDiscSetup(1.8, 28, 20, 20, -15, 1); 
    const env = new Environment(1.2, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(0.180, 0.21, 0.09);
    const simulation = new Simulation(discProps, env);
    // console.log(simulation.updateDiscState(discState, 0.1));
    //const result = simulation.simulate([discState], (states) => states.length < 5);
    const result = simulation.simulate([discState]);
    console.log(result.map((state) => state.r.x).slice(-10), result.length);
  })