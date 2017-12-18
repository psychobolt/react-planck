// @flow
import React from 'react';
import { Vec2 } from 'planck-js';

import { Body, Fixture, Box } from 'src';

type Props = {
  index: number,
  instanceRef: (ref: typeof Body) => void
};

export default ({ index, instanceRef }: Props) => (
  <Body id={`bridge_block_${index + 1}`} ref={instanceRef} type="dynamic" position={new Vec2(161.0 + (2.0 * index), -0.125)}>
    <Fixture density={1.0} friction={0.6}><Box hx={1.0} hy={0.125} /></Fixture>
  </Body>
);
