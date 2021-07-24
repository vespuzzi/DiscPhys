import {Vector3, Json2Vector3}  from '../src/model/Vector3';

test ('default vector has zero components', () => {
  const v = new Vector3();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
  expect(v.z).toBe(0);
})

test ('vector length is square', () => {
  const v = new Vector3(1, 1, 1);
  expect(v.length()).toBe(Math.sqrt(3));
})

test ('vector dot', () => {
  const v = new Vector3(1, 1, 1).dot(Json2Vector3({x: 1, y: 1, z: 1}));
  expect(v).toBe(3);
})

test ('vector angle', () => {
  const i = Json2Vector3({x: 1, y: 0, z: 0});
  const j = Json2Vector3({x: 0, y: 1, z: 0});
  const k = Json2Vector3({x: 0, y: 0, z: 1});
  expect(i.angle(j)).toBeCloseTo(Math.PI/2, 8);
  expect(j.angle(k)).toBeCloseTo(Math.PI/2, 8);
  expect(k.angle(i)).toBeCloseTo(Math.PI/2, 8);
  expect(i.angle(i)).toBeCloseTo(0, 8);
})

test('vector cross product produces perpendicular vector', () => {
  const v1 = new Vector3(3,6,7);
  const v2 = new Vector3(2,8,4);
  console.log(v1.cross(v2));
  expect(v1.cross(v2).dot(v1)).toBeCloseTo(0, 8);
  expect(v1.cross(v2).dot(v2)).toBeCloseTo(0, 8);
})

test ('vector rotate unit vectors', () => {
  const i = Json2Vector3({x: 1, y: 0, z: 0});
  const j = Json2Vector3({x: 0, y: 1, z: 0});
  const k = Json2Vector3({x: 0, y: 0, z: 1});
  expect(i.rotate(k, Math.PI/2).y).toBeCloseTo(1, 7);
  expect(k.rotate(j, Math.PI/2).x).toBeCloseTo(1, 7);
  expect(j.rotate(i, Math.PI/2).z).toBeCloseTo(1, 7);
})

test ('rotation preserves length', () => {
  const v1 = new Vector3(3,6,7);
  const v2 = new Vector3(2,8,4);
  expect(v1.rotate(v2, Math.PI).length()).toBeCloseTo(v1.length(), 7);
  expect(v2.rotate(v1, Math.PI).length()).toBeCloseTo(v2.length(), 7);
})

test ('rotation is additive with respect to same axis', () => {
  const v1 = new Vector3(3,6,7);
  const axis = new Vector3(2,8,4);
  expect(v1.rotate(axis, 1).rotate(axis, 1).equals(v1.rotate(axis, 2))).toBeTruthy();
})

test ('rotation is commutative with respect to same axis', () => {
  const v1 = new Vector3(3,6,7);
  const axis = new Vector3(2,8,4);
  expect(v1.rotate(axis, 2).rotate(axis, 1).equals(v1.rotate(axis, 1).rotate(axis, 2))).toBeTruthy();
})




