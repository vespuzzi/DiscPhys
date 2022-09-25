import { Vector3 } from "./Vector3";
// @ts-ignore
// import Spline from "../../node_modules/cubic-spline/index.js";
const Spline = require('cubic-spline');

export class DiscState {
    readonly r: Vector3; //position
	readonly v: Vector3; //velocity
	readonly w: Vector3; //angular velocity
	readonly n: Vector3; //orientation:  unit vector perpendicular to disc plane pointig to the direction of the disc dome
    constructor (
			r: Vector3 = new Vector3(0,0,1.5), //default initial height = 1.5
			v: Vector3 = new Vector3(0,0,0),
			spin: number = 1,           //revolutions/second, positive sign -> counterclockwise rotation
			n: Vector3 = new Vector3(0,0,1),
		) {
			this.r = r;
			this.v = v;
			this.n = n;
			this.w = n.mul(spin * 2 * Math.PI); //angular velocity [rad/s]
	}
}

// const defaultLiftArgs = [-90, -45, -10,  -5,    -2.5,  0,    5,   10, 15,   20,   25, 30,  40, 45, 64, 90];
// const defaultLiftVals = [0.0, -0.75,-.25, -0.10, 0,   0.14, 0.45, .75, 1,  1.25, 1.5, 1.7, 1.3, 0.9 ,0.3 , 0]; 
const liftCoeff = [
	{angle: -90,	value:  0.00},
	{angle: -80,  	value: -0.06},
	{angle: -45, 	value: -0.75},
	{angle: -10,	value: -0.25},
	{angle: -5,		value: -0.10},
	{angle: -2.5,  	value: 0.00},
	{angle:  0,		value: 0.14},
	{angle: +5,  	value: 0.45},
	{angle: +10,  	value: 0.75},
	{angle: +15,  	value: 1.10},
	{angle: +20,  	value: 1.35},
	{angle: +30,  	value: 1.65},
	{angle: +40,  	value: 1.25},
	{angle: +50,  	value: 0.75},
	{angle: +60,  	value: 0.35},
	{angle: +70,  	value: 0.15},
	{angle: +80,  	value: 0.05},
	{angle: +90,  	value: 0.00},
]
const defaultLiftCoef = new Spline(liftCoeff.map((pair) => pair.angle), liftCoeff.map((pair) => pair.value))

const defaultDragArgs = [-90, -45, -20,   -15, -10, -5,  0,    5,   10, 15, 20,  25,  30,   40,    50, 90];
const defaultDragVals = [1.9, 0.9, 0.38,  .28, .18, .11, 0.1, .15, .27, .4, 0.58, .72, 0.9, 1.3, 1.7, 2.1]; 
const dragCoeff = [
	{angle: -90,	value: 1.8},
	{angle: -45,  	value: 1.1},
	// {angle: -20, 	value: 0.38},
	{angle: -10,	value: 0.18},
	{angle: -5,		value: 0.08},
	{angle:  0,		value: 0.10},
	{angle: +5,  	value: 0.15},
	// {angle: +10,  	value: 0.20},
	// {angle: +15,  	value: 0.40},
	// {angle: +20,  	value: 0.55},
	{angle: +30,  	value: 0.92},
	{angle: +40,  	value: 1.10},
	{angle: +50,  	value: 1.30},
	{angle: +60,  	value: 1.50},
	{angle: +70,  	value: 1.70},
	{angle: +80,  	value: 1.85},
	{angle: +90,  	value: 2.10},
]
const defaultDragCoef = new Spline(dragCoeff.map((pair) => pair.angle), dragCoeff.map((pair) => pair.value));
	 
const defaultPitchingArgs = [-90.   -15,   -10,   -5,    0,     5,  10,    15,    20,    25,   30,    40,  50,    90];
const defaultPitchingVals = [-0.01, -.065, -.04, -.035, -0.02, .01, 0.002, 0.025, 0.045, 0.07, 0.11,  0.17, 0.19, 0.01]; 
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