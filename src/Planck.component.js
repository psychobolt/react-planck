import _ from 'lodash';
import invariant from 'fbjs/lib/invariant';

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
      const [value] = values;
      updatePayload.push(key, value);
    } else if (values.length === 2) {
      const [preValue, nextValue] = values;
      if (!_.isEqual(preValue, nextValue)) {
        updatePayload.push(key, nextValue);
      }
    }
  });
  return updatePayload.length ? updatePayload : null;
}

export function updateProps(instance, updatePayload) {
  for (let i = 1; i < updatePayload.length; i += 2) {
    const key = updatePayload[i - 1];
    const value = updatePayload[i];
    if (key === 'frequencyHz') {
      instance.instances.forEach(joint => joint.setSpringFrequencyHz(value));
    } else if (key === 'motorSpeed') {
      instance.instances.forEach(joint => joint.setMotorSpeed(value));
    } else if (key === 'enableMotor') {
      instance.instances.forEach(joint => joint.enableMotor(value));
    } else {
      invariant(false, 'updateProps is NOOP. Make sure you implement it.');
    }
  }
}
