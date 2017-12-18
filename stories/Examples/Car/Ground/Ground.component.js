import React from 'react';
import { Vec2 } from 'planck-js';

import { Body, Fixture, Edge } from 'src';

const groundFD = {
  density: 0.0,
  friction: 0.6,
};
const hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0];
const dx = 5.0;

export default () => {
  let x = 20.0;
  let y1 = 0.0;
  let key = 0;
  const createHills = () => hs.map(y2 => {
    const fixture = (
      <Fixture key={`hill_segment_${key}`} {...groundFD}>
        <Edge v1={new Vec2(x, y1)} v2={new Vec2(x + dx, y2)} />
      </Fixture>
    );
    y1 = y2;
    x += dx;
    key += 1;
    return fixture;
  });
  const ground = (
    <Body id="ground">
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(-20.0, 0.0)} v2={new Vec2(20.0, 0.0)} />
      </Fixture>
      {createHills()}
      {createHills()}
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(x, 0.0)} v2={new Vec2(x + 40.0, 0.0)} />
      </Fixture>
      {x += 80.0}
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(x, 0.0)} v2={new Vec2(x + 40.0, 0.0)} />
      </Fixture>
      {x += 40.0}
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(x, 0.0)} v2={new Vec2(x + 10.0, 5.0)} />
      </Fixture>
      {x += 20.0}
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(x, 0.0)} v2={new Vec2(x + 40.0, 0.0)} />
      </Fixture>
      {x += 40.0}
      <Fixture {...groundFD}>
        <Edge v1={new Vec2(x, 0.0)} v2={new Vec2(x, 20.0)} />
      </Fixture>
    </Body>
  );
  return ground;
};
