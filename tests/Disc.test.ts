test ('default vector has zero components', () => {
    const xs = [-10, -5,  0,  5,   10, 15, 20,  25, 30,  40,   45, 67, 90];
    const ys = [-.25, 0, .2, 0.4, .6, .9,  1.2, 1.4, 1.7, 0.9, 1.0 ,0.5 , 0]; 
    const spline = new Spline(xs, ys);
    console.log(spline.at(7));
  })