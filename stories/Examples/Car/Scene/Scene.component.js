// @flow
import React from 'react';
import { Vec2 } from 'planck-js';

import { type ViewProps, PlanckContainer, Body, Joint, Fixture, Box } from 'react-planck';
import Ground from '../Ground';
import Teeter from '../Teeter';
import Bridge from '../Bridge';
import Car from '../Car.component';

type Props = {
  viewProps?: ViewProps,
  worldProps?: {}
}

type State = {
  started: boolean
}

export default class Scene extends React.Component<Props, State> {
  car: Car;

  static defaultProps = {
    viewProps: {},
    worldProps: {
      gravity: new Vec2(0, -10),
    },
  }

  state = {
    started: false,
  }

  componentDidMount() {
    this.start();
  }

  setCar = (ref: typeof Body) => { this.car = ref; }

  start() {
    this.setState({
      started: this.car !== undefined,
    });
  }

  render() {
    const { viewProps } = this.props;
    const { started } = this.state;
    const getViewProps = config => ({
      ...(typeof viewProps === 'function' ? viewProps(config) : viewProps),
      keydown: started ? this.car.onKeyDown(config) : null,
      step: started ? this.car.onStep(config) : null,
    });
    return (
      <PlanckContainer {...this.props} viewProps={getViewProps}>
        <Ground />
        <Teeter />
        <Bridge />
        <Joint type="revolute" bodyA="ground" bodyB="teeter" lowerAngle={(-8.0 * Math.PI) / 180.0} upperAngle={(8.0 * Math.PI) / 180.0} enableLimit />
        <Joint type="revolute" bodyA="ground" bodyB="bridge_block_1" anchors={[new Vec2(160.0, -0.125)]} />
        <Joint type="revolute" bodyA="bridge_block_20" bodyB="ground" anchors={[new Vec2(200.0, -0.125)]} />
        <Body type="dynamic" position={new Vec2(230.0, 0.5)}>
          <Fixture density={0.5}>
            <Box hx={0.5} hy={0.5} />
          </Fixture>
        </Body>
        <Body type="dynamic" position={new Vec2(230.0, 1.5)}>
          <Fixture density={0.5}>
            <Box hx={0.5} hy={0.5} />
          </Fixture>
        </Body>
        <Body type="dynamic" position={new Vec2(230.0, 2.5)}>
          <Fixture density={0.5}>
            <Box hx={0.5} hy={0.5} />
          </Fixture>
        </Body>
        <Body type="dynamic" position={new Vec2(230.0, 3.5)}>
          <Fixture density={0.5}>
            <Box hx={0.5} hy={0.5} />
          </Fixture>
        </Body>
        <Body type="dynamic" position={new Vec2(230.0, 4.5)}>
          <Fixture density={0.5}>
            <Box hx={0.5} hy={0.5} />
          </Fixture>
        </Body>
        <Car ref={this.setCar} />
      </PlanckContainer>
    );
  }
}
