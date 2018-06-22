// @flow
import React, { type Node, type ComponentType } from 'react';
import { World } from 'planck-js';

import { diffProps, updateProps } from './Planck.component';
import PlanckRenderer from './Planck.renderer';
import PlanckProvider from './Planck.provider';
import { CONSTANTS } from './Planck.types';
import Testbed, { type Props as TestbedProps, type PropsWithStage } from './components/Testbed';

export type ViewProps = TestbedProps | PropsWithStage;

export type Props = {
  world: typeof World,
  worldProps: {},
  view: ComponentType<any>,
  viewProps: ViewProps,
  renderer: typeof PlanckRenderer,
  children: Node,
};

export class Canvas extends React.Component<Props> {
  static defaultProps = {
    testbedProps: {},
    view: Testbed,
    children: null,
  };

  constructor(props: Props) {
    super(props);
    const { world, renderer } = this.props;
    this.mountNode = renderer.reconciler.createContainer(world);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ worldProps }: Props) {
    const updatePayload = diffProps(worldProps, this.props.worldProps);
    if (updatePayload && updatePayload.length) {
      updateProps(
        this.props.world,
        updatePayload,
        CONSTANTS.World,
        worldProps,
        this.props.worldProps,
      );
    }
    this.update();
  }

  componentWillUnmount() {
    this.props.renderer.reconciler.updateContainer(null, this.mountNode, this);
  }

  update = () => {
    const { renderer, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this);
  };

  mountNode: Object;

  render() {
    const { view: View, viewProps } = this.props;
    if (View === Testbed) {
      const props = typeof viewProps === 'function' ? { getTestbedProps: viewProps } : viewProps;
      return <View {...props} world={this.props.world} />;
    }
    return <View {...viewProps} world={this.props.world} />;
  }
}

// $FlowFixMe
export default React.forwardRef((props, ref) => (
  <PlanckProvider {...props} innerRef={ref} />
));
