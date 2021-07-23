export class Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  mul (c: number) : Vector3 {
    return new Vector3(this.x * c, this.y * c, this.z * c);
  }

  neg (): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  sub(v: Vector3) {
    return new Vector3(this.x-v.x, this.y-v.y, this.z-v.z);
  }

  sum (v: Vector3){
  return new Vector3(this.x+v.x, this.y+v.y, this.z+v.z);
  }

  dot (v: Vector3): number {
    return v.x * this.x + v.y * this.y + v.z * this.z;
  }

  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y*v.z - this.z*v.y,
      this.z*v.x - this.x*v.z,
      this.x*v.y - this.y*v.x);
  }

  /**
   *
   * @param r radius
   * @param azi azimuthal angle (from x-axis: Range:  0 ... 2*PI)
   * @param pol polar angle (from z-axis Range: 0 .. PI )
   */
  spherical(r: number ,azi: number, pol: number): Vector3{
  return new Vector3(
    r * Math.sin(pol) * Math.cos(azi),
    r * Math.sin(pol) * Math.sin(azi),
    r * Math.cos(pol))
  }

  getAzi() : number
  {
    return Math.atan2(this.y, this.x);
  }

  getPol() : number
  {
    return Math.acos(this.z / this.length());
  }

  length() : number
  {
    const sqrSum = this.dot(this);
    return Math.sqrt(sqrSum);
  }

  normalized(): Vector3
  {
    const length = this.length();
    if (length == 0.0) return new Vector3(0, 0, 0);
    return new Vector3(this.x/length, this.y/length, this.z/length);
  }

  angle(v: Vector3): number{
    const cos = this.dot(v)/(this.length()*v.length());
    return(Math.acos(cos));
  }


  /**
  * Right hand rule!
  * @param axis
  * @param angle
  * @return new rotated vector
   */
  rotate(axis: Vector3, angle: number) {
    axis = axis.normalized();
    //Rodriques formula:
    return this.mul(Math.cos(angle)).sum(axis.cross(this).mul(Math.sin(angle))).sum(axis.mul(axis.dot(this)).mul(1-Math.cos(angle)));
}

}
