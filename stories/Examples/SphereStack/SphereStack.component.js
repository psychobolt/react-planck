import React from 'react';
import { Vec2 } from 'planck-js';

import { PlanckContainer, Body, Fixture, Edge, Circle } from 'src';

export default () => {
  const bodies = [];
  const Shape = props => <Circle radius={1.0} {...props} />;
  for (let i = 0; i < 10; i += 1) {
    bodies.push((
      <Body
        key={`dynamic_body_${i}`}
        type="dynamic"
        linearVelocity={new Vec2(0.0, -50.0)}
      >
        <Fixture density={1.0} render={{ stroke: 'red' }}><Shape center={new Vec2(0.0, 4.0 + (3.0 * i))} /></Fixture>
      </Body>
    ));
  }
  return (
    <PlanckContainer worldProps={new Vec2(0, -10)}>
      <Body>
        <Fixture density={0.0}>
          <Edge v1={new Vec2(-40.0, 0.0)} v2={new Vec2(40.0, 0.0)} fixDef={0.0} />
        </Fixture>
      </Body>
      {bodies}
    </PlanckContainer>
  );
};
