import { DiscProps } from '../src/model/Disc'

test ('lift coeff', () => {
    const disc = new DiscProps();
    console.log(disc.cLift.at(-5));
    console.log(disc.cLift.at(-2));
    console.log(disc.cLift.at(-80));
  })