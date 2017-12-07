import React from 'react';
import { storiesOf } from '@storybook/react';

import SphereStack from './SphereStack';
import Car from './Car';

const width = 680;
const height = 480;
const ratio = 16;

const props = {
  canvasProps: {
    style: {
      width: `${width}px`,
      height: `${height}px`,
    },
  },
  testbedProps: {
    width: width / ratio,
    height: width / ratio,
    ratio: 16,
  },
};

storiesOf('Examples', module)
  .add('Sphere Stack', () => <SphereStack {...props} />)
  // .add('Hello Box2D', () => (
  //   <PlanckContainer></PlanckContainer>
  // ))
  .add('Car', () => <Car {...props} />);
