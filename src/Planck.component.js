import isEqual from 'lodash/isEqual';
import invariant from 'fbjs/lib/invariant';

import TYPES, { CONSTANTS } from './Planck.types';

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

export function updateProps(instance, updatePayload, type, oldProps, newProps) {
  if (type === CONSTANTS.Box) {
    Object.assign(instance, TYPES[CONSTANTS.BOX](newProps));
    return;
  } else if (type === CONSTANTS.Polygon) {
    Object.assign(instance, TYPES[CONSTANTS.Polygon](newProps));
    return;
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
    } else if (key === 'center' && type === CONSTANTS.Circle) {
      instance.m_p.set(value);
    } else if (key === 'v1') {
      instance.m_vertex1.set(value);
    } else if (key === 'v2') {
      instance.m_vertex2.set(value);
    } else if (key === 'radius') {
      Object.assign(instance, { m_radius: value });
    } else {
      invariant(false, 'updateProps is NOOP. Make sure you implement it.');
    }
  }
}
