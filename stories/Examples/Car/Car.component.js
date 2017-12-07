// @flow
import React from 'react';
import typeof Stage from 'stage-js/lib';
import { Vec2, typeof Body as PlBody, typeof WheelJoint as PlWheelJoint } from 'planck-js/lib';

import { Body, Joint, Fixture, Circle, Polygon } from 'src';

const ZETA = 0.7;
const SPEED = 50.0;

type Props = {};

type State = {
  hz: number,
  speed: number,
  enableSpringBackMotor: boolean,
};

export default class Car extends React.Component<Props, State> {
  state = {
    hz: 4.0,
    speed: 0.0,
    enableSpringBackMotor: true,
  }

  onKeyDown = (stage: Stage) => () => {
    const { up, down } = stage.activeKeys;
    if (down) {
      this.onDownKey();
    } else if (up) {
      this.onUpKey();
    }
  }

  onDownKey() {
    this.setState({
      hz: Math.max(0.0, this.state.hz - 1.0),
      enableSpringBackMotor: true,
    });
  }

  onUpKey() {
    this.setState({
      hz: this.state.hz + 1.0,
      enableSpringBackMotor: true,
    });
  }

  onLeftRightKey() {
    this.setState({
      speed: 0.0,
      enableSpringBackMotor: true,
    });
  }

  onLeftKey() {
    this.setState({
      speed: SPEED,
      enableSpringBackMotor: true,
    });
  }

  onRightKey() {
    this.setState({
      speed: -SPEED,
      enableSpringBackMotor: true,
    });
  }

  onStep = (stage: Stage) => () => {
    const carPosition = this.car.getPosition();
    const { left, right } = stage.activeKeys;
    if (left && right) {
      this.onLeftRightKey();
    } else if (left) {
      this.onLeftKey();
    } else if (right) {
      this.onRightKey();
    } else {
      this.setState({
        speed: 0.0,
        enableSpringBackMotor: false,
      });
    }
    let { x } = stage;
    if (carPosition.x > stage.x + 10) x = carPosition.x - 10;
    else if (carPosition.x < stage.x - 10) x = carPosition.x + 10;
    Object.assign(stage, { x });
  }

  setCar = (ref: PlBody) => { this.car = ref; }

  car: PlBody
  springBack: PlWheelJoint
  springFront: PlWheelJoint
  HZ = 4.0

  render() {
    return [
      <Body key="car" id="car" ref={this.setCar} type="dynamic" position={new Vec2(0.0, 1.0)}>
        <Fixture density={1.0}>
          <Polygon vertices={[
            new Vec2(-1.5, -0.5),
            new Vec2(1.5, -0.5),
            new Vec2(1.5, 0.0),
            new Vec2(0.0, 0.9),
            new Vec2(-1.15, 0.9),
            new Vec2(-1.5, 0.2),
          ]}
          />
        </Fixture>
      </Body>,
      <Body key="wheel_back" id="wheel_back" type="dynamic" position={new Vec2(-1.0, 0.35)}><Fixture density={1.0} friction={0.9}><Circle radius={0.4} /></Fixture></Body>,
      <Joint
        key="spring_back"
        type="wheel"
        motorSpeed={this.state.speed}
        maxMotorTorque={20.0}
        enableMotor={this.state.enableSpringBackMotor}
        frequencyHz={this.state.hz}
        dampingRatio={ZETA}
        bodyA="car"
        bodyB="wheel_back"
        axis={new Vec2(0.0, 1.0)}
      />,
      <Body key="wheel_front" id="wheel_front" type="dynamic" position={new Vec2(1.0, 0.4)}><Fixture density={1.0} friction={0.9}><Circle radius={0.4} /></Fixture></Body>,
      <Joint
        key="spring_front"
        type="wheel"
        motorSpeed={0.0}
        maxMotorTorque={10.0}
        enableMotor={false}
        frequencyHz={this.state.hz}
        dampingRatio={ZETA}
        bodyA="car"
        bodyB="wheel_front"
        axis={new Vec2(0.0, 1.0)}
      />,
    ];
  }
}
