// @flow
import React from 'react';
import { Vec2 } from 'planck-js';

import { Body, Fixture, Circle, Polygon } from 'src';

const scale = (x = 1, y = 1) => v => new Vec2(v.x * x, v.y * y);

const railProps = {
  friction: 0.1,
  restitution: 0.9,
  userData: 'rail',
};

export const pocketProps = {
  userData: 'pocket',
};

const SPI4 = Math.sin(Math.PI / 4);

type Props = {
  width: number,
  height: number,
  pocketRadius: number,
}

export default ({ width, height, pocketRadius }: Props) => {
  const railH = [
    new Vec2(pocketRadius, height * 0.5),
    new Vec2(pocketRadius, (height * 0.5) + pocketRadius),
    new Vec2(((width * 0.5) - (pocketRadius / SPI4)) + pocketRadius, (height * 0.5) + pocketRadius),
    new Vec2((width * 0.5) - (pocketRadius / SPI4), height * 0.5),
  ];

  const railV = [
    new Vec2(width * 0.5, -((height * 0.5) - (pocketRadius / SPI4))),
    new Vec2(
      (width * 0.5) + pocketRadius,
      -(((height * 0.5) - (pocketRadius / SPI4)) + pocketRadius),
    ),
    new Vec2((width * 0.5) + pocketRadius, ((height * 0.5) - (pocketRadius / SPI4)) + pocketRadius),
    new Vec2(width * 0.5, (height * 0.5) - (pocketRadius / SPI4)),
  ];
  return (
    <React.Fragment>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railV.map(scale(+1, +1))} />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railV.map(scale(-1, +1))} />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railH.map(scale(+1, +1))} />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railH.map(scale(-1, +1))} />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railH.map(scale(+1, -1))} />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...railProps}>
          <Polygon vertices={railH.map(scale(-1, -1))} />
        </Fixture>
      </Body>

      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(0, -(height * 0.5) - (pocketRadius * 1.5))}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(0, +(height * 0.5) + (pocketRadius * 1.5))}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>

      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(
              +(width * 0.5) + (pocketRadius * 0.7),
              +(height * 0.5) + (pocketRadius * 0.7),
            )}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(
              -(width * 0.5) - (pocketRadius * 0.7),
              +(height * 0.5) + (pocketRadius * 0.7),
            )}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>

      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(
              +(width * 0.5) + (pocketRadius * 0.7),
              -(height * 0.5) - (pocketRadius * 0.7),
            )}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>
      <Body>
        <Fixture {...pocketProps}>
          <Circle
            center={new Vec2(
              -(width * 0.5) - (pocketRadius * 0.7),
              -(height * 0.5) - (pocketRadius * 0.7),
            )}
            radius={pocketRadius}
          />
        </Fixture>
      </Body>
    </React.Fragment>
  );
};
