// @flow
import React from 'react';
import { Vec2, type Contact } from 'planck-js';

import { type ViewProps, PlanckContainer } from 'src';

import Table, { pocketProps } from './Table';
import Rack, { ballFixProps } from './Rack';

type Props = {
  viewProps: ViewProps
};

const WIDTH = 8.0;
const HEIGHT = 4.0;
const POCKET_R = 0.2;
const BALL_R = 0.12;

export default class EightBall extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateViewProps(props.viewProps);
  }

  componentDidMount() {
    if (this.container) {
      this.container.world.on('post-solve', this.pocketBall);
    }
  }

  componentWillReceiveProps(props: Props) {
    if (this.props.viewProps !== props.viewProps) {
      this.updateViewProps(props.viewProps);
    }
  }

  componentWillUnmount() {
    if (this.container) {
      this.container.world.off('post-solve', this.pocketBall);
    }
  }

  setContainer = (ref: typeof PlanckContainer) => { this.container = ref; };

  pocketBall = (contact: Contact) => {
    const fA = contact.getFixtureA();
    const bA = fA.getBody();
    const fB = contact.getFixtureB();
    const bB = fB.getBody();
    const pocket = (fA.getUserData() === pocketProps.userData && bA) ||
                   (fB.getUserData() === pocketProps.userData && bB);
    const ball = (fA.getUserData() === ballFixProps.userData && bA) ||
                  (fB.getUserData() === ballFixProps.userData && bB);
    setTimeout(() => {
      if (pocket && ball && this.container) {
        this.container.world.destroyBody(ball);
      }
    }, 1);
  }

  updateViewProps(viewProps: ViewProps) {
    this.viewProps = config => ({
      ...(typeof viewProps === 'function' ? viewProps(config) : viewProps),
      x: 0,
      y: 0,
      pixelsPerMeter: 100,
      mouseForce: -30,
    });
  }

  viewProps: ViewProps
  container: ?typeof PlanckContainer

  render() {
    return (
      <PlanckContainer ref={this.setContainer} {...this.props} viewProps={this.viewProps}>
        <Table width={WIDTH} height={HEIGHT} pocketRadius={POCKET_R} />
        <Rack ballRadius={BALL_R} offset={new Vec2(WIDTH / 4, 0)} />
      </PlanckContainer>
    );
  }
}
