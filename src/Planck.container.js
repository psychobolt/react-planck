// @flow
import React, { type Node, type ComponentType } from 'react';
import { World } from 'planck-js';
import PropTypes from 'prop-types';

import { diffProps, updateProps } from './Planck.component';
import PlanckRenderer from './Planck.renderer';
import { CONSTANTS } from './Planck.types';
import Testbed, { type Props as TestbedProps, type PropsWithStage } from './components/Testbed';

export type ViewProps = TestbedProps | PropsWithStage;

type Props = {
  worldProps: {},
  view: ComponentType<any>,
  viewProps: ViewProps,
  renderer: typeof PlanckRenderer,
  children: Node,
};

export default class PlanckContainer extends React.Component<Props> {
  static defaultProps = {
    worldProps: {},
    testbedProps: {},
    view: Testbed,
    renderer: PlanckRenderer,
    children: null,
  };

  static childContextTypes = {
    world: PropTypes.instanceOf(World).isRequired,
  };

  constructor(props: Props) {
    super(props);
    const Renderer = this.props.renderer;
    const renderer = new Renderer();
    const { reconciler } = renderer;
    this.world = renderer.createInstance(CONSTANTS.World, this.props.worldProps);
    const node = reconciler.createContainer(this.world);
    this.update = () => {
      const { children } = this.props;
      reconciler.updateContainer(children, node, this);
    };
    this.unmount = () => {
      reconciler.updateContainer(null, node, this);
    };
  }

  getChildContext() {
    return { world: this.world };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ worldProps }: Props) {
    const updatePayload = diffProps(worldProps, this.props.worldProps);
    if (updatePayload && updatePayload.length) {
      updateProps(this.world, updatePayload, CONSTANTS.World, worldProps, this.props.worldProps);
    }
    this.update();
  }

  componentWillUnmount() {
    this.unmount();
  }

  update: () => void
  unmount: () => void

  world: typeof World

  render() {
    const { view: View, viewProps } = this.props;
    if (View === Testbed) {
      const props = typeof viewProps === 'function' ? { getTestbedProps: viewProps } : viewProps;
      return <View {...props} world={this.world} />;
    }
    return <View {...viewProps} world={this.world} />;
  }
}
