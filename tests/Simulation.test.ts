import { DiscProps, DiscState } from "../src/model/Disc";
import { deg2Rad, Environment, getInitialDiscState, initializeDiscState, Simulation } from "../src/model/Simulator";
import { spherical, Vector3 } from "../src/model/Vector3";


test ('Simulation', () => {
    const discState =  getInitialDiscState(1.8, 28, 20, 20, -15, 1); 
    const env = new Environment(1.2, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(0.180, 0.21, 0.09);
    const simulation = new Simulation(discProps, env);
    // console.log(simulation.updateDiscState(discState, 0.1));
    //const result = simulation.simulate([discState], (states) => states.length < 5);
    const result = simulation.simulate([discState]);
    console.log(result.map((state) => state.r.x).slice(-10), result.length);
  })

  test ('Symmetry when spin negated', () => {
    const env = new Environment(1.2, new Vector3(0,0,0), new Vector3(0,0,-9.81));
    const discProps = new DiscProps(0.180, 0.21, 0.09);
    const discStateNegSpin =  initializeDiscState({releaseHeight: 1.1, speed: 15, spin: -10, pitchAngle: 30, tilt: 0, initialAoA: 2});
    const discStatePosSpin =  initializeDiscState({releaseHeight: 1.1, speed: 15, spin: +10, pitchAngle: 30, tilt: 0, initialAoA: 2});
    const simulationNegSpin = new Simulation(discProps, env);
    const negRes = simulationNegSpin.simulate([discStateNegSpin]);

    // const simulationPosSpin = new Simulation(discProps, env);
    // const posRes = simulationPosSpin.simulate([discStatePosSpin]);



  })