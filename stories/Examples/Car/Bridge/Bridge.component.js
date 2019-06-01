// @flow
import React from 'react';
import { Vec2 } from 'planck-js';

import { Joint } from 'react-planck';
import Block from './Block';

export default () => {
  const blocks = [];
  const anchors = [];
  for (let i = 0; i < 20; i += 1) {
    blocks.push(<Block key={`bridge_block_${i}`} index={i} />);
    anchors.push(new Vec2(162.0 + (2.0 * i), -0.125));
  }
  return (
    <Joint type="revolute" anchors={anchors}>
      {blocks}
    </Joint>
  );
};
