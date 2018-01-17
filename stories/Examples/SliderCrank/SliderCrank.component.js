// @flow
import React from 'react';
import { Vec2, type RevoluteJoint, type PrismaticJoint } from 'planck-js';

import { type ViewProps, PlanckContainer, Body, Fixture, Box, Edge, Joint } from 'src';

type Props = {
  viewProps: ViewProps
}

export default class SliderCrank extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateViewProps(props.viewProps);
  }

  componentWillReceiveProps(props: Props) {
    if (this.props.viewProps !== props.viewProps) {
      this.updateViewProps(props.viewProps);
    }
  }

  setJoint1 = (ref: RevoluteJoint) => { this.joint1 = ref; };

  setJoint2 = (ref: PrismaticJoint) => { this.joint2 = ref; };

  updateViewProps(viewProps: ViewProps) {
    this.viewProps = config => ({
      ...(typeof viewProps === 'function' ? viewProps(config) : viewProps),
      keydown: (code, char) => {
        switch (char) {
          case 'Z':
            this.joint2.enableMotor(!this.joint2.isMotorEnabled());
            this.joint2.getBodyB().setAwake(true);
            break;
          case 'X':
            this.joint1.enableMotor(!this.joint1.isMotorEnabled());
            this.joint1.getBodyB().setAwake(true);
            break;
          default:
        }
      },
    });
  }

  viewProps: ViewProps
  joint1: RevoluteJoint;
  joint2: PrismaticJoint;

  render() {
    return (
      <PlanckContainer
        worldProps={new Vec2(0, -10)}
        viewProps={this.viewProps}
      >
        <Body id="ground"><Fixture><Edge v1={new Vec2(-40.0, 0.0)} v2={new Vec2(40.0, 0.0)} /></Fixture></Body>
        <Body id="crank" type="dynamic"><Fixture density={2.0}><Box hx={0.5} hy={2.0} center={new Vec2(0.0, 7.0)} /></Fixture></Body>
        <Joint type="revolute" ref={this.setJoint1} motorSpeed={Math.PI} maxMotorTorque={10000.0} enableMotor bodyA="ground" bodyB="crank" anchors={[new Vec2(0.0, 5.0)]} />
        <Body id="follower" type="dynamic"><Fixture density={2.0}><Box hx={0.5} hy={4.0} center={new Vec2(0.0, 13.0)} /></Fixture></Body>
        <Joint type="revolute" bodyA="crank" bodyB="follower" anchors={[new Vec2(0.0, 9.0)]} />
        <Body id="piston" type="dynamic" fixedRotation><Fixture density={2.0}><Box hx={1.5} hy={1.5} center={new Vec2(0.0, 17.0)} /></Fixture></Body>
        <Joint type="revolute" bodyA="follower" bodyB="piston" anchors={[new Vec2(0.0, 17.0)]} />
        <Joint type="prismatic" ref={this.setJoint2} maxMotorForce={1000.0} enableMotor bodyA="ground" bodyB="piston" anchors={[new Vec2(0.0, 17.0)]} axis={new Vec2(0.0, 1.0)} />
        <Body type="dynamic"><Fixture density={2.0}><Box hx={1.5} hy={1.5} center={new Vec2(0.0, 23.0)} /></Fixture></Body>
      </PlanckContainer>
    );
  }
}
