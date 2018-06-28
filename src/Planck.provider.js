// @flow
import React from 'react';
import typeof { World } from 'planck-js';

import PlanckRenderer from './Planck.renderer';
import { Canvas, type Props as ChildProps, type ViewProps } from './Planck.container'; // eslint-disable-line import/no-cycle
import { CONSTANTS } from './Planck.types';

export const Context = React.createContext();

type Props = {
  worldProps: {},
  viewProps: ViewProps,
  innerRef: Object,
  renderer: PlanckRenderer,
  mergeProps: () => any
} & ChildProps;

type State = {
  world: World,
};

export default class PlanckProvider extends React.Component<Props, State> {
  static defaultProps = {
    worldProps: {},
    renderer: PlanckRenderer,
  }

  constructor(props: Props) {
    super(props);
    const Renderer = props.renderer;
    const { worldProps } = this.props;
    this.renderer = new Renderer();
    this.state = {
      world: this.renderer.createInstance(CONSTANTS.World, worldProps),
      mergeProps: props.mergeProps
        || (mergeProps => this.setState(state => mergeProps(state, props))),
    };
  }

  renderer: PlanckRenderer;

  render() {
    const { innerRef, children, ...rest } = this.props;
    return (
      <Canvas {...rest} {...this.state} ref={innerRef} renderer={this.renderer}>
        <Context.Provider value={this.state}>
          {children}
        </Context.Provider>
      </Canvas>
    );
  }
}
