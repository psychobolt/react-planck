// @flow
import React from 'react';
import { Vec2, Math } from 'planck-js';

import { type ViewProps, PlanckContainer, Body, Fixture, Circle, Box } from 'src';

type Props = {
  viewProps: ViewProps
}

export default ({ viewProps }: Props) => {
  const bodies = [];
  for (let i = 0; i < 50; i += 1) {
    bodies.push((
      <Body key={`body_${i + 1}`} type="dynamic">
        <Fixture densitiy={0.01}>
          <Circle center={new Vec2(Math.random(0.0, -6.0), Math.random(-1.0, 1.0))} radius={0.1} />
        </Fixture>
      </Body>
    ));
  }
  return (
    <PlanckContainer
      viewProps={config => ({
        ...(typeof viewProps === 'function' ? viewProps(config) : viewProps),
        y: 0,
        speed: 0.5,
      })}
    >
      {bodies}
      <Body type="dynamic" position={new Vec2(-40.0, 0.0)} bullet linearVelocity={new Vec2(100.0, 0.0)}>
        <Fixture density={1.0}>
          <Box hx={1.5} hy={1.5} />
        </Fixture>
      </Body>
    </PlanckContainer>
  );
};
