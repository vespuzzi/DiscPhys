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

export const defaultSimulationSetup = {
    releaseHeight: {value: 1.4, prompt: 'Release height',                   
                     unit: 'm',     min: 0.5,  max: 2.5, step: 0.1, category: 'discState',
                     tooltip: 'Distance from ground in the beginning'}, 
    speed:          {value: 100, prompt: 'Speed',                            
                     unit: 'km/h',   min: 5,  max: 160, step: 1, category: 'discState',
                     tooltip: "Magnitude of the velocity in the beginning"},
    spin:           {value: -25, prompt: 'Spin: right handed bh < 0 < fore', 
                     unit: 'Hz',   min: -40,  max: 40, step: 1, category: 'discState',
                     tooltip: 'Disc rotation speed as revolutions per second. Positive direction is counterclockwise (right hand curl rule)'},
    pitchAngle:     {value: 5,   prompt: 'Pitch angle',                      
                     unit: '°',   min: -10,  max: 90, step: 0.5, category: 'discState',
                     tooltip: 'Initial direction of the disc velocity. 0° means horizontal'},
    initialAoA:     {value: 0,   prompt: 'Initial angle of attack',          
                     unit: '°',   min: -45,  max: 90, step: 0.5, category: 'discState',
                     tooltip: 'Angle between disc plane and disc velocity'}, 
    tilt:           {value: 0,   prompt: 'Tilt: left < 0 < right',           
                     unit: '°',   min: -180,  max: 180, step: 0.5, category: 'discState',
                     tooltip: 'Initial sideways tilt of the disc. Positive values mean tilt to the right (right hand curl rule when rotating disc normal vector about velocity vector) '},
    airDensity:     {value: 1.2, prompt: 'Air density: ',                    
                     unit: 'kg/m^3', min: 0.5,  max: 1.5, step: 0.01, category: 'discState', 
                     tooltip: 'Air density varies with altitude and temperature. At sea level 30°C -> 1.16kg/m^3, -25°C -> 1.422kg/m^3'},
    windSpeed:      {value: 0,   prompt: 'Wind speed',                       
                     unit: 'm/s',  min: 0.5,  max: 15, step: 0.1, category: 'environment',
                     tooltip: 'Magnitude of wind velocity in horizontal plane'},
    windDirection:  {value: 0,   prompt: 'Wind direction: from left < 0 < from right',           
                     unit: '°',   min: -180,  max: 180, step: 0.5, category: 'environment',
                     tooltip: 'Direction of wind: positive values mean wind blowing from right. Absolute values < 90 mean tailwind'},
    windUpdraft:    {value: 0, prompt: 'Wind updraft',                            
                     unit: 'm/s',   min: -5,  max: 5, step: 0.1, category: 'environment',
                     tooltip: 'Vertical component of wind. Positive values mean updraft'},
    discMass:       {value: 180, prompt: 'Disc mass',                            
                     unit: 'g',   min: 10,  max: 250, step: 1, category: 'discProps',
                     tooltip: 'Disc mass in grams. Maximum PDGA approved weight is 200g'},
    discDiameter:   {value: 21, prompt: 'Disc diameter',                            
                     unit: 'cm',   min: 5,  max: 40, step: 0.2, category: 'discProps',
                     tooltip: 'Minimum PDGA approved diameter is 21cm'},
    discMassRadius:  {value: 10.5, prompt: 'Disc mass radius',                            
                      unit: 'cm', min: 1,  max: 10.5, step: 0.1, category: 'discProps',
                      tooltip: 'Radius of a ring that has the same moment of inertia as the disc (Roc3 has 9cm mass radius, Star Boss 8.4cm )'},
}

export class Simulation {
    readonly A: number              //   disc area
    readonly I: number              //   moment of inertia along principal axis
    env: Environment;
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
    
    randomPerturbance(magnitude:number= 0.0001): Vector3 {
        return new Vector3(Math.random()*magnitude, Math.random()*magnitude, Math.random()*magnitude);
    }

    updateDiscState(discState: DiscState, dt: number) : DiscState{
        //Spin direction: if disc normal vector and angular speed direction are same spin direction is positive ie. counterclockwise otherwise clockwise
        this.spinDirection = this.spinDirection ? this.spinDirection : Math.sign(discState.w.dot(discState.n))
        const va = discState.v.sub(this.env.windVelocity);           //Disc air velocity
        this.env.windVelocity = this.env.windVelocity.sum(this.randomPerturbance())
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
 * @param tilt          Tilt of the disc in degrees larger value means more tilt to the right. 
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
  const velocity = spherical(speed/3.6, 0, deg2Rad(90-pitchAngle));
  const ori = spherical(1, deg2Rad(180), deg2Rad(pitchAngle + initialAoA)).rotate(velocity, deg2Rad(tilt)); 
  return new DiscState(position, velocity, spin, ori)
}

export function initializeDiscState(setup: any):DiscState{
    return getInitialDiscState(
              setup.releaseHeight.value,
              setup.speed.value,
              setup.spin.value,
              setup.pitchAngle.value,
              setup.tilt.value,
              setup.initialAoA.value
              );
}
export function initializeEnvironment(setup: any): Environment{
    return new Environment(
        setup.airDensity.value, 
        new Vector3(
            setup.windSpeed.value*Math.cos(deg2Rad(setup.windDirection.value)),
            setup.windSpeed.value*Math.sin(deg2Rad(setup.windDirection.value)),
            setup.windUpdraft.value),
        new Vector3(0, 0, -9.81)
    )    
}



