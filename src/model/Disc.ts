import { Json2Vector3, Vector3 } from "./Vector3";
// @ts-ignore
// import Spline from "../../node_modules/cubic-spline/index.js";
const Spline = require('cubic-spline');

export class DiscState {
    readonly r: Vector3; //position
	readonly v: Vector3; //velocity
	// double V; //disk speed = ||v|| relative to ground
	// double Va; //disk speed relative to air
	readonly L: Vector3; //angular momentum
	readonly n: Vector3;//orientation:  unit vector perpendicular to disc plane
	// double A; 
	// double I; //moment of inertia
	// double w; //angular speed;
	// double rho; //air density
	// double dt;
	// double t; 
	// double g=-9.81; //acceleration of gravity
	// Vector G = new Vector();
	// double aoa; 
	// Vector drag;
	// Vector lift;
	// Vector F = new Vector(); //Resultant of aerodynamic forces
	// Vector T = new Vector(); //Resultant of aerodynamic moments
	// Vector a = new Vector(); //acceleration
	// double counterClockWiseness = -1.0; // right hand backhand or lefthand forehand -> -1 disc normal opposite to angular velocity
    constructor (
			r: Vector3 = new Vector3(0,0,0),
			v: Vector3 = new Vector3(0,0,0),
			L: Vector3 = new Vector3(0,0,0),
			n: Vector3 = new Vector3(0,0,1),	
		) {
			this.r = r;
			this.v = v;
			this.L = L;
			this.n = n;
	}
}

const defaultLiftArgs = [-90, -45, -10, -5,  0,  5,   10, 15, 20,  25, 30,  40,   45, 67, 90];
const defaultLiftVals = [0.0, -0.9,-.25, 0, .2, 0.4, .6, .9,  1.2, 1.4, 1.7, 0.9, 1.0 ,0.5 , 0]; 
const defaultLiftCoef = new Spline(defaultLiftArgs, defaultLiftVals);

const defaultDragArgs = [-90, -45, -15, -10, -5,  0,  5,   10, 15, 20,  25,  30,  40, 50, 90];
const defaultDragVals = [1.3, 0.9, .17, .15, .19, .1, .15, .29, .4,  .59, .72, .9, 1.01, 1.08, 1.4]; 
const defaultDragCoef = new Spline(defaultDragArgs, defaultDragVals);

const defaultPitchingArgs = [-90.   -15,   -10,   -5,    0,     5,  10,    15,    20,    25,   30,    40,  50,    90];
const defaultPitchingVals = [-0.01, -.065, -.05, -.035, -0.02, .01, 0.001, 0.025, 0.045, 0.07, 0.11,  0.17, 0.19, 0.01]; 
const defaultPitchingCoef = new Spline(defaultPitchingArgs, defaultPitchingVals);


export class DiscProps {
	readonly m: number; //mass
	readonly d: number; //disc diameter
	readonly rm: number; // mass radius: -> moment of inertia
	readonly cLift: any;  //Lift coefficient as function of angle of attack in degrees implementeed as cubic spline 
	readonly cDrag: any;  //Drag coefficient as function of angle of attack in degrees implementeed as cubic spline 
	readonly cPitching: any; //Pitching moment coefficient as function of angle in degrees implementeed as cubic spline 
	// double A;
	// double I; //moment of inertia
	constructor (
		m: number = 0.180,
		d: number = 0.21,
		rm: number = 0.9 * d/2,
		cLift: any = defaultLiftCoef,
		cDrag: any = defaultDragCoef,
		cPitching: any = defaultPitchingCoef
	) {
		this.m = m;
		this.d = d
		this.rm = rm;
		this.cLift = cLift;
		this.cDrag = cDrag;
		this.cPitching = cPitching;
	}

	cLiftData(start: number, end: number, step: number): any {
		return this.coeffData(start, end, step, this.cLift);
	} 

	cDragData(start: number, end: number, step: number): any {
		return this.coeffData(start, end, step, this.cDrag);
	}

	cPitchingData(start: number, end: number, step: number): any {
		return this.coeffData(start, end, step, this.cPitching);
	}

    coeffData(start: number, end: number, step: number, spline: any): any {
		const data = [];
		for (var x = start; x <= end; x+= step) {
			data.push({x, y: spline.at(x)});
		}
		return data;
	} 
}