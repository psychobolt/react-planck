import { DistanceJoint, WheelJoint, RevoluteJoint, PrismaticJoint } from 'planck-js';

export const JointTypes = {
  REVOLUTE: 'revolute',
  WHEEL: 'wheel',
  CHAIN: 'chain',
  PRISMATIC: 'prismatic',
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
    this.update(def);
  }

  update(def) {
    const { type, anchors, axis, ...rest } = def;
    this.def = rest;
    this.anchors = anchors || [];
    this.type = type;
    this.axis = axis;
  }

  setParent(parent) {
    this.parent = parent;
  }

  addBody(body) {
    this.bodies.push(body);
  }

  getBody(key) {
    const { userData } = this.def;
    let body;
    if (userData) {
      body = userData[key];
      if (typeof body === 'string') {
        body = findBody(this.parent.getBodyList(), body);
      }
    }
    return body;
  }

  addAnchor(anchor) {
    this.anchors.push(anchor);
  }

  getJoints() {
    const { type, def, anchors } = this;
    const newBodies = [];

    let body = this.getBody('$$bodyA');
    if (body) {
      newBodies.push(body);
    }
    body = this.getBody('$$bodyB');
    if (body) {
      newBodies.push(body);
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
      case JointTypes.REVOLUTE:
        joint = new RevoluteJoint(def, bodyA, bodyB, anchors[0] || bodyB.getPosition());
        break;
      case JointTypes.WHEEL:
        joint = new WheelJoint(def, bodyA, bodyB, anchors[0] || bodyB.getPosition(), this.axis);
        break;
      case JointTypes.PRISMATIC:
        joint = new PrismaticJoint(
          def,
          bodyA,
          bodyB,
          anchors[0] || bodyB.getPosition(),
          this.axis,
        );
        break;
      case JointTypes.CHAIN:
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
