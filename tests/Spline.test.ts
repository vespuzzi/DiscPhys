const Spline = require('cubic-spline');

test ('Spline gives values between inputpoints', () => {
  const xs = [-10.0, -5,  0,    5,   10,  15,   20,  25,  30,  40,   45, 67, 90];
  const ys = [-.250, 0,   0.2,  0.4, 0.6, 0.9,  1.2, 1.4, 1.7, 0.9, 1.0 ,0.5 , 0]; 
  const spline = new Spline(xs, ys);
  expect(spline.at(7)).toBeGreaterThan(0.4);
})

