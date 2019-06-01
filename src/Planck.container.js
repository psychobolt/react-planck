// @flow
import React, { type Node, type ComponentType } from 'react';
import { World } from 'planck-js';

import { diffProps, updateProps } from './Planck.component';
import PlanckRenderer from './Planck.renderer';
import PlanckProvider from './Planck.provider'; // eslint-disable-line no-unused-vars
import { CONSTANTS } from './Planck.types';
import Testbed, { type Props as TestbedProps, type PropsWithStage } from './components/Testbed';

export type ViewProps = TestbedProps | PropsWithStage;

export type Props = {
  world: typeof World,
  worldProps: {},
  testbedProps?: {},
  view?: ComponentType<any>,
  viewProps: ViewProps,
  renderer: typeof PlanckRenderer,
  children?: Node,
};

// $FlowFixMe
@PlanckProvider
class PlanckContainer extends React.Component<Props> {
  static defaultProps = {
    testbedProps: {},
    view: Testbed,
    children: null,
  };

  mountNode: Object;

  constructor(props: Props) {
    super(props);
    const { world, renderer } = this.props;
    this.mountNode = renderer.reconciler.createContainer(world);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(props: Props) {
    const { world, worldProps } = this.props;
    const updatePayload = diffProps(props.worldProps, worldProps);
    if (updatePayload && updatePayload.length) {
      updateProps(
        world,
        updatePayload,
        CONSTANTS.World,
        props.worldProps,
        worldProps,
      );
    }
    this.update();
  }

  componentWillUnmount() {
    const { renderer } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
  }

  update = () => {
    const { renderer, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this);
  };

  render() {
    const { view: View, viewProps, world } = this.props;
    if (!View) return null;
    if (View === Testbed) {
      const props = typeof viewProps === 'function' ? { getTestbedProps: viewProps } : viewProps;
      return <View {...props} world={world} />;
    }
    return <View {...viewProps} world={world} />;
  }
}

// $FlowFixMe
export default React.forwardRef((props, ref) => (
  <PlanckContainer {...props} innerRef={ref} />
));
