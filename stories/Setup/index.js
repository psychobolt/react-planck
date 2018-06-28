import React from 'react';
import { storiesOf } from '@storybook/react';

import Resizable from './Resizable';

storiesOf('Setup', module)
  .add('Testbed w/ Dynamic Width and Height', () => (
    <div>
      <div>
        {'Drag borders to resize the canvas'}
      </div>
      <Resizable />
    </div>
  ));
