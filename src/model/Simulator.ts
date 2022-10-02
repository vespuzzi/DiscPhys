import { DiscProps, DiscState } from "./Disc";
import { spherical, Vector3 } from "./Vector3";

export class Environment{
    readonly rho : number; // air density;
    private _windVelocity!: Vector3;
    public get windVelocity(): Vector3 {
        return this._windVelocity;
    }
    public set windVelocity(value: Vector3) {
        this._windVelocity = value;
    }
    readonly G: Vector3;
    constructor (rho: number = 1.2, _windVelocity: Vector3 = new Vector3(0,0,0), G: Vector3 = new Vector3(0, 0, -9.81)) {
        this.rho = rho;
        this.windVelocity = _windVelocity;
        this.G = G;
    }
}
/**
 * Simulation setup contains initial values for simulation in "human understandable form"
 */
export class SimulationSetup{
    [name: string]: number;
    releaseHeight = 1.4; 
    speed = 30;
    spin = -25; 
    pitchAngle = 10; 
    tilt = 0;  
    initialAoA = 0; 
    airDensity = 1.2;
    windSpeed = 0;
    windDirection = 0; //0 = tailwind, 
    windUpdraft = 0;
    discMass = 180;  //g
    discDiameter = 21; //cm
    discMassRadius = 9 //cm
}

export class Simulation {
    readonly A: number              //   disc area
    readonly I: number              //   moment of inertia along principal axis
    readonly env: Environment;
    readonly discProps: DiscProps;
    spinDirection: number | undefined;
    curL: Vector3 | undefined;

    constructor (discProps: DiscProps, env: Environment = new Environment()){
        const discRadius = discProps.d/2; 
        this.A = Math.PI * discRadius * discRadius;
                   //mass radius     
        this.I = discProps.m * discProps.rm * discProps.rm   //moment of inertia along principal axis
        this.env = env;
        this.discProps = discProps;

    }


    updateDiscState(discState: DiscState, dt: number) : DiscState{
        //Spin direction: if disc normal vector and angular speed direction are same spin direction is positive ie. counterclockwise otherwise clockwise
        this.spinDirection = this.spinDirection ? this.spinDirection : Math.sign(discState.w.dot(discState.n))
        const va = discState.v.sub(this.env.windVelocity);           //Disc air velocity
        const Va = va.length();                                      //Disc air speed
        const q = .5 * this.A * this.env.rho * Va * Va;              //Dynamic pressure; 
        const aoa = rad2Deg(va.angle(discState.n)-Math.PI/2);        //angle of attack in degrees
        const vn = va.normalized();                                  //Direction vector of disc air speed
        const curL = discState.w.mul(this.I)  //Angular momentum;
        //Lift 
        const mLift = q * this.discProps.cLift.at(aoa)                 //lift magnitude, negative values switch the direction 
        const n = discState.n;  
        // console.log('n', JSON.stringify(n));
        const lift = n.sub(vn.mul(n.dot(vn))).normalized().mul(mLift);   //direction of the lift times lift magnitude 
                                                                         // direction = n - (projection of n onto va) normalized
        //Drag
        const mDrag = q * this.discProps.cDrag.at(aoa);                  //Magnitude of drag force
        const drag = vn.mul(-mDrag);
        //Sum All forces acting: lift, drag and gravity 
        const F = lift.sum(drag).sum(this.env.G.mul(this.discProps.m));        
        
        //Pitching torque
        const mPitch = q * this.discProps.d * this.discProps.cPitching.at(aoa); //magnitude of aerodynamic pitcing torque
        const pitch = va.cross(n).normalized().mul(mPitch);      //pitching moment is perpendicular to airspeed and disc normal vector  
        const spindownCoeff = 0.01; // rotation is slowing down only slightly
        // const spindownTorque = discState.w.normalized().mul(spindownCoeff);
        // const torq = pitch.sum(spindownTorque);                                                         //estimated slow down of rotation
        //Kinematics: r = r0 + v0*dt + 1/2 * a * dt^2    v = v0 + a*dt, a = F/m,  rotation: L = Torq * dt 
        const a = F.mul(1/this.discProps.m);
        const r = discState.r.sum(discState.v.mul(dt)).sum(a.mul(.5).mul(dt*dt));
        const v = discState.v.sum(a.mul(dt));
        const newL = curL.sum(pitch.mul(dt)).mul(1-dt*spindownCoeff); 
        //angular momentum length is always positive. multiplying by spindirection yields clockwise/counterclocwise 
        const spin = newL.mul(1/this.I).length()/(2 * Math.PI) * this.spinDirection; 
        //to calculate disc normal vector direction angular momentum must be multiplied by spin direction
        return new DiscState(r, v, spin, newL.normalized().mul(this.spinDirection)); 
    }
    

    defCont = (states: DiscState[]) => states[states.length-1].r.z > 0; 

    simulate(discStates: DiscState[], continueCondition: (states: DiscState[]) => boolean = this.defCont): DiscState[]{
        const curState = discStates[discStates.length-1];
        return continueCondition(discStates) ? //curState.r.z > 0 ?
            this.simulate([...discStates, this.updateDiscState(curState, 0.01)], continueCondition) :
            discStates;
       
    }
}

export function rad2Deg(rad: number)
{
    return rad/Math.PI*180;
}

export function deg2Rad(deg: number)
{
    return deg/180*Math.PI;
}

/**
 * @param releaseHeight Height from ground ie. z coordinate in meters. (x: forward, y: sideways growing left)    
 * @param speed         Magnitude of the velocity of the disc in meters per second
 * @param spin          Rotation speed of the disc in revolutions per second
 * @param pitchAngle    Direction of the disc motion in degrees: larger value means more upwards  from xy-plane
 * @param anhyzer       Tilt of the disc in degrees larger value means more tilt to the left. Negative values mean hyzer
 * @param initialAoA    Initial angle of attack in degrees: Angle between disc plane and disc velocity
 * @return              Initial disc state
 */
export function getInitialDiscState(
    releaseHeight:number, 
    speed: number,
    spin: number,  
    pitchAngle: number, 
    tilt: number,  
    initialAoA: number): DiscState{
  const position = new Vector3(0,0, releaseHeight);  
  const velocity = spherical(speed, 0, deg2Rad(90-pitchAngle));
  const ori = spherical(1, deg2Rad(180), deg2Rad(pitchAngle + initialAoA)).rotate(velocity, deg2Rad(tilt)); 
  return new DiscState(position, velocity, spin, ori)
}

export function initializeDiscState(setup: SimulationSetup):DiscState{
    return getInitialDiscState(
              setup.releaseHeight,
              setup.speed,
              setup.spin,
              setup.pitchAngle,
              setup.tilt,
              setup.initialAoA
              );
}
export function initializeEnvironment(setup: SimulationSetup): Environment{
    return new Environment(
        setup.airDensity, 
        new Vector3(
            setup.windSpeed*Math.cos(deg2Rad(setup.windDirection)),
            setup.windSpeed*Math.sin(deg2Rad(setup.windDirection)),
            setup.windUpdraft),
        new Vector3(0, 0, -9.81)
    )    
}



