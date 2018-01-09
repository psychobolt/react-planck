import isEqual from 'lodash/isEqual';
import invariant from 'fbjs/lib/invariant';
import { Body } from 'planck-js';

import TYPES, { CONSTANTS, mapBodyPropsToUserData } from './Planck.types';

function indexProps(dictionary, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children') return;
    const values = dictionary[key];
    if (values) {
      values.push(value);
    } else {
      dictionary[key] = [value]; // eslint-disable-line no-param-reassign
    }
  });
}

export function diffProps(oldProps, newProps) {
  const updatePayload = [];
  const propChanges = {};
  indexProps(propChanges, oldProps);
  indexProps(propChanges, newProps);
  Object.entries(propChanges).forEach(([key, values]) => {
    if (values.length === 1) {
      if (key in newProps) {
        const [value] = values;
        updatePayload.push(key, value);
      } else {
        updatePayload.push(key, null);
      }
    } else if (values.length === 2) {
      const [preValue, nextValue] = values;
      if (!isEqual(preValue, nextValue)) {
        updatePayload.push(key, nextValue);
      }
    }
  });
  return updatePayload.length ? updatePayload : null;
}

function updateJoint(instance, props) {
  instance.update(mapBodyPropsToUserData(props));
  const { parent, instances } = instance;
  instances.map(joint => parent.destroyJoint(joint));
  instance.setInstances(instance.getJoints(parent).map(joint => parent.createJoint(joint)));
}

export function updateProps(instance, updatePayload, type, oldProps, newProps) {
  if (type === CONSTANTS.Box) {
    Object.assign(instance, TYPES[CONSTANTS.Box](newProps));
    return;
  } else if (type === CONSTANTS.Polygon) {
    Object.assign(instance, TYPES[CONSTANTS.Polygon](newProps));
    return;
  } else if (type === CONSTANTS.Joint) {
    if (updatePayload.includes('type') ||
        updatePayload.includes('axis') ||
        updatePayload.includes('bodyA') ||
        updatePayload.includes('bodyB')) {
      updateJoint(instance, newProps);
      return;
    }
  }
  for (let i = 1; i < updatePayload.length; i += 2) {
    const key = updatePayload[i - 1];
    const value = updatePayload[i];
    if (key === 'frequencyHz') {
      instance.instances.forEach(joint => joint.setSpringFrequencyHz(value));
    } else if (key === 'motorSpeed') {
      instance.instances.forEach(joint => joint.setMotorSpeed(value));
    } else if (key === 'enableMotor') {
      instance.instances.forEach(joint => joint.enableMotor(value));
    } else if (key === 'dampingRatio') {
      instance.instances.forEach(joint => joint.setSpringDampingRatio(value));
    } else if (key === 'center' && type === CONSTANTS.Circle) {
      instance.m_p.set(value);
    } else if (key === 'v1') {
      instance.m_vertex1.set(value);
    } else if (key === 'v2') {
      instance.m_vertex2.set(value);
    } else if (key === 'radius') {
      Object.assign(instance, { m_radius: value });
    } else if (key === 'type' && type === CONSTANTS.Body) {
      switch (value) {
        case Body.STATIC:
          instance.instance.setStatic();
          break;
        case Body.DYNAMIC:
          instance.instance.setDynamic();
          break;
        default:
          invariant(false, 'Body type unsupported.');
      }
    } else if (key === 'linearVelocity') {
      instance.instance.setLinearVelocity(value);
    } else if (key === 'density') {
      instance.instance.setDensity(value);
    } else if (key === 'friction') {
      instance.instance.setFriction(value);
    } else if (key === 'render') {
      Object.assign(instance.instance, { render: value });
    } else {
      invariant(false, 'updateProps is NOOP. Make sure you implement it.');
    }
  }
}
