// @flow
import React from 'react';
import typeof Stage from 'stage-js/lib';
import { Vec2, typeof World as PlWorld } from 'planck-js/lib';
import { testbed } from 'planck-js/testbed';

import { PlanckContainer, Body, Joint, Fixture, Box } from 'src';
import Ground from '../Ground';
import Teeter from '../Teeter';
import Bridge from '../Bridge';
import Car from '../Car.component';

type Props = {};

export default class extends React.Component<Props> {
  componentWillUnmount() {
    Object.assign(this.stage, {
      keydown: null,
      step: null,
    });
    this.stage = null;
  }

  setCar = (ref: typeof Car) => { this.car = ref; }

  simulate = (world: PlWorld) => testbed(stage => {
    this.stage = stage;
    Object.assign(stage, {
      keydown: this.car.onKeyDown(stage),
      step: this.car.onStep(stage),
    });
    return world;
  })

  stage: Stage
  car: typeof Car

  render() {
    return (
      <PlanckContainer
        {...this.props}
        render={this.simulate}
        worldProps={{
          gravity: new Vec2(0, -10),
        }}
      >
        <Ground />
        <Teeter />
        <Bridge />
        <Joint type="revolute" bodyA="ground" bodyB="teeter" lowerAngle={(-8.0 * Math.PI) / 180.0} upperAngle={(8.0 * Math.PI) / 180.0} enableLimit />
        <Joint type="revolute" bodyA="ground" bodyB="bridge_block_1" anchors={[new Vec2(160.0, -0.125)]} />
        <Joint type="revolute" bodyA="bridge_block_20" bodyB="ground" anchors={[new Vec2(200.0, -0.125)]} />
        <Body type="dynamic" position={new Vec2(230.0, 0.5)}><Fixture density={0.5}><Box hx={0.5} hy={0.5} /></Fixture></Body>
        <Body type="dynamic" position={new Vec2(230.0, 1.5)}><Fixture density={0.5}><Box hx={0.5} hy={0.5} /></Fixture></Body>
        <Body type="dynamic" position={new Vec2(230.0, 2.5)}><Fixture density={0.5}><Box hx={0.5} hy={0.5} /></Fixture></Body>
        <Body type="dynamic" position={new Vec2(230.0, 3.5)}><Fixture density={0.5}><Box hx={0.5} hy={0.5} /></Fixture></Body>
        <Body type="dynamic" position={new Vec2(230.0, 4.5)}><Fixture density={0.5}><Box hx={0.5} hy={0.5} /></Fixture></Body>
        <Car ref={this.setCar} />
      </PlanckContainer>
    );
  }
}
