import Reconciler from 'react-reconciler';
import { Body, Shape } from 'planck-js';
import invariant from 'fbjs/lib/invariant';

import TYPES from './Planck.types';
import { FixtureDef, JointDef } from './types';
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
    if (instance instanceof JointDef || instance instanceof FixtureDef) {
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
    } else if (parent instanceof Body && child instanceof FixtureDef) {
      const { render, ...def } = child.def;
      const fixture = parent.createFixture(child.shape, def);
      fixture.render = render;
      child.setInstances([fixture]);
    } else if (parent instanceof JointDef && child instanceof Body) {
      parent.addBody(child);
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
      if (parent instanceof Body && child instanceof FixtureDef) {
        const { render, ...def } = child.def;
        const fixture = parent.createFixture(child.shape, def);
        fixture.render = render;
        child.setInstances([fixture]);
      } else if (parent instanceof FixtureDef && child instanceof Shape) {
        parent.setShape(child);
      } else {
        invariant(false, 'appendChild is NOOP. Make sure you implement it.');
      }
    },
    appendChildToContainer(world, child) {
      if (child instanceof Body) {
        // do nothing
      } else if (child instanceof JointDef) {
        child.setInstances(child.getJoints(world).map(joint => world.createJoint(joint)));
      } else {
        invariant(false, 'appendChildToContainer is NOOP. Make sure you implement it.');
      }
    },
    insertBefore(parent, child, beforeChild) {
      invariant(false, 'insertBefore is NOOP. Make sure you implement it.');
    },
    insertInContainerBefore(container, child, beforeChild) {
      invariant(false, 'insertInContainerBefore is NOOP. Make sure you implement it.');
    },
    removeChild(parent, child) {
      if (parent instanceof Body && child instanceof FixtureDef) {
        child.instances.forEach(fixture => {
          const next = fixture.getNext();
          parent.destroyFixture(fixture);
          // Workaround for updating fixture list. See issue https://github.com/shakiba/planck.js/issues/41
          let current = parent.getFixtureList();
          if (current === fixture) {
            Object.assign(parent, { m_fixtureList: next });
          } else {
            while (current != null) {
              if (current === fixture) break;
              current = current.getNext();
            }
            current.m_next = next;
          }
        });
      } else if (parent instanceof FixtureDef && child instanceof Shape) {
        parent.setShape(null);
      } else {
        invariant(false, 'removeChild is NOOP. Make sure you implement it.');
      }
    },
    removeChildFromContainer(world, child) {
      if (child instanceof Body) {
        world.destroyBody(child);
      } else if (child instanceof JointDef) {
        child.instances.forEach(joint => world.destroyJoint(joint));
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
