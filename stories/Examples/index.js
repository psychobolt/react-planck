import React from 'react';
import { storiesOf } from '@storybook/react';

import SphereStack from './SphereStack';
import Car from './Car';
import View from './shared/View';

storiesOf('Examples', module)
  .addDecorator(story => <View>{story()}</View>)
  .add('Sphere Stack', () => <SphereStack />)
  // .add('Hello Box2D', () => (
  //   <PlanckContainer></PlanckContainer>
  // ))
  .add('Car', () => <Car />);
