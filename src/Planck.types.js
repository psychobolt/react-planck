import planck from 'planck-js';
import _ from 'lodash';

import { BodyDef, FixtureDef, JointDef } from './types';

export const CONSTANTS = {
  World: 'World',
  Body: 'Body',
  Joint: 'Joint',
  Fixture: 'Fixture',
  Edge: 'Edge',
  Box: 'Box',
  Circle: 'Circle',
  Polygon: 'Polygon',
};

export function mapIdToUserData(props) {
  const { id, userData, ...rest } = props;
  if (id) {
    return { ...rest, userData: { ...userData, $$id: id } };
  }
  return props;
}

export function mapBodyPropsToUserData(props) {
  const { bodyA, bodyB, ...rest } = props;
  let { userData } = props;
  if (bodyA) {
    userData = { ...userData, $$bodyA: bodyA };
  }
  if (bodyB) {
    userData = { ...userData, $$bodyB: bodyB };
  }
  return { ...rest, userData };
}

const mapJointPropsToUserData = _.flowRight([mapIdToUserData, mapBodyPropsToUserData]);

export default {
  [CONSTANTS.World]: props => new planck.World(props),
  [CONSTANTS.Body]: (props, world) => {
    const instance = new BodyDef(mapIdToUserData(props));
    instance.setInstance(world.createBody(instance.def));
    return instance;
  },
  [CONSTANTS.Fixture]: props => new FixtureDef(mapIdToUserData(props)),
  [CONSTANTS.Joint]: props => new JointDef(mapJointPropsToUserData(props)),
  [CONSTANTS.Edge]: ({ v1, v2 }) => new planck.Edge(v1, v2),
  [CONSTANTS.Box]: ({ hx, hy, center, angle }) => new planck.Box(hx, hy, center, angle),
  [CONSTANTS.Circle]: ({ center = planck.Vec2.zero(), radius }) =>
    new planck.Circle(center, radius),
  [CONSTANTS.Polygon]: ({ vertices }) => new planck.Polygon(vertices),
};

export const {
  Body,
  Joint,
  Fixture,
  Edge,
  Box,
  Circle,
  Polygon,
} = CONSTANTS;
