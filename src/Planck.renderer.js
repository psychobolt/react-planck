import Reconciler from 'react-reconciler';
import { Shape } from 'planck-js';
import invariant from 'fbjs/lib/invariant';

import TYPES from './Planck.types';
import { BodyDef, FixtureDef, JointDef } from './types';
import { diffProps, updateProps } from './Planck.component';

export function getTypes(instanceFactory) {
  return (type, { children, ...rest }, container) => {
    const TYPE = instanceFactory[type];
    return TYPE && TYPE(rest, container, children);
  };
}

const createInstance = getTypes(TYPES);

/* eslint-disable no-unused-vars */
const defaultHostConfig = {
  getRootHostContext(rootHostContext) {
    return rootHostContext;
  },
  getChildHostContext(parentHostContext, type, instance) {
    return parentHostContext;
  },
  getPublicInstance(instance) {
    if (instance instanceof BodyDef || instance instanceof FixtureDef) {
      return instance.instance;
    } else if (instance instanceof JointDef) {
      return instance.instances.length > 1 ? instance.instances : instance.instances[0];
    }
    return instance;
  },
  createInstance,
  appendInitialChild(parent, child) {
    if (!child) {
      return; // TODO remove
    }
    if (parent instanceof FixtureDef && child instanceof Shape) {
      parent.setShape(child);
    } else if (parent instanceof BodyDef && child instanceof FixtureDef) {
      const { render, ...def } = child.def;
      const fixture = parent.instance.createFixture(child.shape, def);
      fixture.render = render;
      child.setInstance(fixture);
    } else if (parent instanceof JointDef && child instanceof BodyDef) {
      parent.addBody(child.instance);
    } else {
      invariant(false, 'appendInitialChild is NOOP. Make sure you implement it.');
    }
  },
  finalizeInitialChildren(instance, type, props) {
    return true;
  },
  prepareUpdate(instance, type, oldProps, newProps, container, hostContext) {
    return diffProps(oldProps, newProps);
  },
  shouldSetTextContent(type, props) {
  // invariant(false, 'shouldSetTextContent is NOOP. Make sure you implement it or return false.');
    return false;
  },
  shouldDeprioritizeSubtree(type, props) {
    return false;
  },
  createTextInstance(text, paper, hostContext, internalInstanceHandle) {
    // invariant(false, 'createTextInstance is NOOP. Make sure you implement it or return text.');
    return null;
  },
  scheduleDeferredCallback: window.requestIdleCallback,
  prepareForCommit() {
  },
  resetAfterCommit() {
  },
  useSyncScheduling: true,
  now: Date.now,
  mutation: {
    commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      updateProps(instance, updatePayload, type, oldProps, newProps);
    },
    commitMount(instance, type, newProps, internalInstanceHandle) {
    },
    commitTextUpdate(instance, type, newProps, internalInstanceHandle) {
    },
    resetTextContent(insntace) {
    },
    appendChild(parent, child) {
      if (parent instanceof BodyDef && child instanceof FixtureDef) {
        const { render, ...def } = child.def;
        const fixture = parent.instance.createFixture(child.shape, def);
        fixture.render = render;
        child.setInstance(fixture);
      } else if (parent instanceof FixtureDef && child instanceof Shape) {
        parent.setShape(child);
      } else {
        invariant(false, 'appendChild is NOOP. Make sure you implement it.');
      }
    },
    appendChildToContainer(world, child) {
      if (child instanceof BodyDef) {
        if (child.instance.m_destroyed) child.setInstance(world.createBody(child.def));
      } else if (child instanceof JointDef) {
        child.setParent(world);
        child.setInstances(child.getJoints().map(joint => world.createJoint(joint)));
      } else if (!child) {
        // do nothing
      } else {
        invariant(false, 'appendChildToContainer is NOOP. Make sure you implement it.');
      }
    },
    insertBefore(parent, child, beforeChild) {
      invariant(false, 'insertBefore is NOOP. Make sure you implement it.');
    },
    insertInContainerBefore(container, child, beforeChild) {
      if (child instanceof BodyDef && beforeChild instanceof JointDef) {
        if (child.instance.m_destroyed) child.setInstance(container.createBody(child.def));
      } else {
        invariant(false, 'insertInContainerBefore is NOOP. Make sure you implement it.');
      }
    },
    removeChild(parent, child) {
      if (parent instanceof BodyDef && child instanceof FixtureDef) {
        const body = parent.instance;
        const fixture = child.instance;
        const next = fixture.getNext();
        body.destroyFixture(fixture);
        child.setInstance(null);
      } else if (parent instanceof FixtureDef && child instanceof Shape) {
        parent.setShape(null);
      } else {
        invariant(false, 'removeChild is NOOP. Make sure you implement it.');
      }
    },
    removeChildFromContainer(world, child) {
      if (child instanceof BodyDef) {
        world.destroyBody(child.instance);
        child.setInstance(null);
      } else if (child instanceof JointDef) {
        child.instances.forEach(joint => world.destroyJoint(joint));
        child.setInstances(null);
      } else if (!child) {
        // do nothing
      } else {
        invariant(false, 'removeChildFromContainer is NOOP. Make sure you implement it.');
      }
    },
  },
};
/* eslint-enable no-unused-vars */

export default class PlanckRenderer {
  defaultHostConfig = defaultHostConfig;
  defaultTypes = TYPES;

  constructor() {
    const instanceFactory = this.getInstanceFactory();
    let hostConfig = this.getHostConfig();
    if (this.defaultTypes !== instanceFactory) {
      this.createInstance = getTypes(instanceFactory);
      hostConfig = {
        ...hostConfig,
        createInstance: this.createInstance,
      };
    } else {
      this.createInstance = createInstance;
    }
    this.reconciler = Reconciler(hostConfig);
  }

  getInstanceFactory() {
    return this.defaultTypes;
  }

  getHostConfig() {
    return this.defaultHostConfig;
  }
}
