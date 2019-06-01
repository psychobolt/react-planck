// @flow
import React from 'react';
import { Vec2, Math } from 'planck-js';

import { Body, Fixture, Circle } from 'react-planck';

const SPI3 = Math.sin(Math.PI / 3);
const BLACK = { fill: 'black', stroke: 'white' };
const WHITE = { fill: 'white', stroke: 'black' };
const COLORS = [
  { fill: '#ffdd00', stroke: '#000000' },
  { fill: '#ffdd00', stroke: '#ffffff' },
  { fill: '#ff3300', stroke: '#000000' },
  { fill: '#ff3300', stroke: '#ffffff' },
  { fill: '#662200', stroke: '#000000' },
  { fill: '#662200', stroke: '#ffffff' },
  { fill: '#ff8800', stroke: '#000000' },
  { fill: '#ff8800', stroke: '#ffffff' },
  { fill: '#00bb11', stroke: '#000000' },
  { fill: '#00bb11', stroke: '#ffffff' },
  { fill: '#9900ff', stroke: '#000000' },
  { fill: '#9900ff', stroke: '#ffffff' },
  { fill: '#0077ff', stroke: '#000000' },
  { fill: '#0077ff', stroke: '#ffffff' },
];

export const ballFixProps = {
  friction: 0.1,
  restitution: 0.99,
  density: 1,
  userData: 'ball',
};

const ballBodyProps = {
  linearDamping: 1.5,
  angularDamping: 1,
};

type Ball = {
  x?: number,
  y?: number,
  center?: Vec2,
  render?: Function
};

const rack: number => Ball[] = r => {
  const n = 5;
  const balls = [];
  const d = 2 * r;
  const l = SPI3 * d;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      balls.push({
        x: (i * l) + Math.random(r * 0.02),
        y: ((j - (i * 0.5)) * d) + Math.random(r * 0.02),
      });
    }
  }
  return balls;
};

const translate = (offset = Vec2.zero()) => v => new Vec2(v.x + offset.x, v.y + offset.y);

type Props = {
  ballRadius: number,
  offset: typeof Vec2
}

export default ({ offset, ballRadius }: Props) => {
  const balls: Ball[] = rack(ballRadius).map(v => ({ center: translate(offset)(v) }));
  balls.push({ center: new Vec2(-offset.x, 0) });
  COLORS.forEach((color, i) => Object.assign(balls[i], { render: color }));
  balls[14].render = balls[4].render;
  balls[4].render = BLACK;
  balls[balls.length - 1].render = WHITE;
  return (
    <React.Fragment>
      {balls.map(({ center, render }, i) => (
        <Body type="dynamic" key={`ball_${i + 1}`} {...ballBodyProps} bullet>
          <Fixture {...ballFixProps} render={render}>
            <Circle center={center} radius={ballRadius} />
          </Fixture>
        </Body>
      ))}
    </React.Fragment>
  );
};
