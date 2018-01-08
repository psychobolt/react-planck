import { DistanceJoint, WheelJoint, RevoluteJoint } from 'planck-js';

export const TYPES = {
  Revolute: 'revolute',
  Wheel: 'wheel',
  Chain: 'chain',
};

const findBody = (body, id) => {
  for (let next = body; next; next = next.getNext()) {
    const userData = next.getUserData();
    if (userData && userData.$$id === id) return next;
  }
  return null;
};

export default class JointDef {
  bodies = [];

  constructor(def) {
    const { type, anchors, axis, ...rest } = def;
    this.def = rest;
    this.anchors = anchors || [];
    this.type = type;
    this.axis = axis;
  }

  addBody(body) {
    this.bodies.push(body);
  }

  addAnchor(anchor) {
    this.anchors.push(anchor);
  }

  getJoints(world) {
    const { type, def, anchors } = this;
    const { userData } = def;
    const newBodies = [];

    if (userData) {
      const { $$bodyA, $$bodyB } = userData;
      [$$bodyA, $$bodyB].forEach(body => {
        let newBody = body;
        if (typeof newBody === 'string') {
          newBody = findBody(world.getBodyList(), newBody);
          if (newBody) {
            newBodies.push(newBody);
          }
        } else {
          newBodies.push(body);
        }
      });
    }

    if (newBodies.length) {
      this.bodies = newBodies;
    }

    const { bodies } = this;

    if (bodies.length > 2) {
      const joints = [];
      let prevBody = bodies[0];
      for (let i = 1; i < bodies.length; i += 1) {
        const currentBody = bodies[i];
        joints.push(new RevoluteJoint(
          def,
          prevBody,
          currentBody,
          anchors.length < i ? currentBody.getPosition() : anchors[i - 1],
        ));
        prevBody = currentBody;
      }
      return joints;
    }

    const [bodyA, bodyB] = bodies;
    let joint;

    switch (type) {
      case TYPES.Revolute:
        joint = new RevoluteJoint(def, bodyA, bodyB, anchors[0] || bodyB.getPosition());
        break;
      case TYPES.Joint:
        joint = new WheelJoint(def, bodyA, bodyB, anchors[0] || bodyB.getPosition(), this.axis);
        break;
      case TYPES.Chain:
      default: {
        const anchorA = bodyA && anchors.length < 1 ? bodyA.getPosition() : anchors[0];
        const anchorB = bodyB && anchors.length < 2 ? bodyB.getPosition() : anchors[1];
        joint = new DistanceJoint(def, bodyA, anchorA, bodyB, anchorB);
      }
    }

    return [joint];
  }

  setInstances(instances) {
    this.instances = instances;
  }
}
