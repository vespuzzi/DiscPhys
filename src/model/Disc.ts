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

// Potts & Crowther 2007

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
	 
const pitchinMomentCoeff = [
	{angle: -90,	value: -0.00},
	{angle: -50,  	value: -0.220},
	{angle: -15,  	value: -0.080},
	{angle: -10,	value: -0.045},
	{angle: -5,		value: -0.035},
	{angle:  0,		value: -0.015},
	{angle: +5,  	value: -0.008},

	{angle: +9,  	value:  0.00},
	{angle: +11,  	value:  0.011},
	{angle: +22,  	value:  0.065},
	{angle: +26,  	value:  0.100},
	{angle: +35,  	value:  0.150},
	{angle: +40,  	value:  0.170},
	{angle: +50,  	value:  0.190},
	// {angle: +70,  	value: 1.70},
	// {angle: +80,  	value: 1.85},
	{angle: +90,  	value: 0.00},
]
const defaultPitchingCoef = new Spline(pitchinMomentCoeff.map((pair) => pair.angle), pitchinMomentCoeff.map((pair) => pair.value));
//const defaultPitchingCoef = new Spline(defaultPitchingArgs, defaultPitchingVals);


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