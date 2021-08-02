import { DiscProps, DiscState } from "./Disc";
import { Vector3 } from "./Vector3";

export class Environment{
    readonly rho : number; // air density;
    readonly windVelocity : Vector3;
    readonly G: Vector3;
    constructor (rho: number = 1.2, windVelocity: Vector3 = new Vector3(0,0,0), G: Vector3 = new Vector3(0, 0, 9.81)) {
        this.rho = rho;
        this.windVelocity = windVelocity;
        this.G = G;
    }
}

export function Simulator (discState: DiscState, discProps: DiscProps, env: Environment = new Environment()){
    const r = discProps.d/2           //disc radius
    const A = Math.PI * r * r;        //disc area
    const Rm = discProps.rm           //mass radius     
    const I = discProps.m * Rm * Rm   //moment of inertia along principal axis
    const counterClockWiseness = -Math.sign(discState.w.dot(discState.n)); 
    let L = discState.n.mul(discState.w.length()).mul(I) //angular momentum;

    return function updateDiscState(discState: DiscState, dt: number) : DiscState{
        //helper values
        const va = discState.v.sub(env.windVelocity);           //Disc air velocity
        const Va = va.length();                                 //Disc air speed
        const q = .5 * A * env.rho * Va * Va;                   //Dynamic pressure; 
        const aoa = radAsDeg(va.angle(discState.n)-Math.PI/2);  //angle of attack in degrees
        const vn = va.normalized();                             //Direction vector of disc air speed
        //Aerodynamic forces
        //Lift 
        const mLift = q * discProps.cLift.at(aoa)                 //lift magnitude
        const n = discState.n;                           
        const lift = n.sub(vn.mul(n.dot(vn))).normalized().mul(mLift);     //direction of the lift times lift magnitude
        //Drag
        const mDrag = q * discProps.cDrag(aoa);                  //Magnitude of drag force
        const drag = vn.mul(-mDrag);
        //Sum All forces acting: lift, drag and gravity 
        const F = lift.sum(drag).sum(env.G);        
        
        //Pitching torque
        const mPitch = q * discProps.d * discProps.cPitching.at(aoa); //magnitude of aerodynamic pitcing torque
        const pitch = va.cross(n).normalized().mul(mPitch);      //pitching moment is perpendicular to airspeed and disc normal vector  
        const spindownCoeff = -0.00004; // rotation is slowing down only slightly
        const spindownTorque = discState.w.normalized().mul(q*discProps.d*spindownCoeff);
        const torq = pitch.sum(spindownTorque);                                                         //estimated slow down of rotation
        //Kinematics: r = r0 + v0*t + 1/2 * a * t^2    v = v0 + at, a = F/m, rotation: L = Torq * dt 
        const a = F.mul(1/discProps.m);
        const r = discState.r.sum(discState.v.mul(dt)).sum(a.mul(.5).mul(dt*dt));
        const v = discState.v.sum(a.mul(dt));
        L = L.sum(torq.mul(dt));                               
        const spin = L.mul(1/I).length()/(2 * Math.PI); 
        return new DiscState(r, v, spin, L.normalized().mul(counterClockWiseness));
    }

	function radAsDeg(rad: number)
	{
		return rad/Math.PI*180;
	}
	
	function degAsRad(deg: number)
	{
		return deg/180*Math.PI;
	}


}

let discState = new DiscState();
var updateDiscState = Simulator(new DiscState(), new DiscProps(), new Environment);
discState = updateDiscState(discState, 0.01);
