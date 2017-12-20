import React from 'react';
import { storiesOf } from '@storybook/react';

import SphereStack from './SphereStack';
import Car from './Car';

storiesOf('Examples', module)
  .add('Sphere Stack', () => <SphereStack />)
  // .add('Hello Box2D', () => (
  //   <PlanckContainer></PlanckContainer>
  // ))
  .add('Car', () => <Car />);
