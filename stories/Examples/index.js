import React from 'react';
import { storiesOf } from '@storybook/react';

import SphereStack from './SphereStack';
import Car from './Car';
import EightBall from './EightBall';
import AddPair from './AddPair';
import SliderCrank from './SliderCrank';
import View from './shared/View';

storiesOf('Examples', module)
  .addDecorator(story => <View>{story()}</View>)
  .add('8-Ball', () => <EightBall />)
  .add('Add Pair', () => <AddPair />)
  .add('Car', () => <Car />)
  .add('Slider Crank', () => <SliderCrank />)
  .add('Sphere Stack', () => <SphereStack />);
