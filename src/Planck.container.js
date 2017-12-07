// @flow
import React, { type Node } from 'react';
import { World } from 'planck-js/lib';
import { testbed } from 'planck-js/testbed';
import PropTypes from 'prop-types';

import PlanckRenderer from './Planck.renderer';
import { CONSTANTS } from './Planck.types';

type TestbedProps = {
  width: number,
  height: number,
};

type Props = {
  canvasProps: {},
  worldProps: {},
  testbedProps: TestbedProps,
  render: (world: typeof World, testbedProps: ?TestbedProps) => any,
  renderer: typeof PlanckRenderer,
  children: Node
};

const defaultRender = (world: typeof World, testbedProps: TestbedProps) =>
  testbed(defaultProps => {
    Object.assign(defaultProps, testbedProps);
    return world;
  });

export default class PlanckContainer extends React.Component<Props> {
  static defaultProps = {
    canvasProps: {},
    worldProps: {},
    testbedProps: {},
    render: defaultRender,
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
    const { render, testbedProps } = this.props;
    if (render === defaultRender) {
      render(this.world, testbedProps);
    } else if (render) {
      render(this.world);
    }
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    this.unmount();
  }

  update: () => void
  unmount: () => void

  world: typeof World

  render() {
    return <canvas id="stage" {...this.props.canvasProps} />;
  }
}
