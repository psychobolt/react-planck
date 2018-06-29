// @flow
import * as React from 'react';
import typeof { World } from 'planck-js';

import PlanckRenderer from './Planck.renderer';
import { CONSTANTS } from './Planck.types';

export const Context = React.createContext();

type Props = {
  worldProps: {},
  innerRef: Object,
  renderer: PlanckRenderer,
  mergeProps: () => any,
  children: React.Node
};

type State = {
  world: World,
};

export default (Container: React.ComponentType<any>) => class PlanckProvider
  extends React.Component<Props, State> {
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
      <Container {...rest} {...this.state} ref={innerRef} renderer={this.renderer}>
        <Context.Provider value={this.state}>
          {children}
        </Context.Provider>
      </Container>
    );
  }
};
