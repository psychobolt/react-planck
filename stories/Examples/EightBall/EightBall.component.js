// @flow
import React from 'react';
import { Vec2, World, type Contact } from 'planck-js';

import { type ViewProps, PlanckContainer, Context } from 'react-planck';

import Table, { pocketProps } from './Table';
import Rack, { ballFixProps } from './Rack';

type Props = {
  world: typeof World
};

const WIDTH = 8.0;
const HEIGHT = 4.0;
const POCKET_R = 0.2;
const BALL_R = 0.12;

class EightBall extends React.Component<Props> {
  componentDidMount() {
    const { world } = this.props;
    world.on('post-solve', this.pocketBall);
  }

  componentWillUnmount() {
    const { world } = this.props;
    world.off('post-solve', this.pocketBall);
  }

  pocketBall = (contact: Contact) => {
    const fA = contact.getFixtureA();
    const bA = fA.getBody();
    const fB = contact.getFixtureB();
    const bB = fB.getBody();
    const pocket = (fA.getUserData() === pocketProps.userData && bA)
                    || (fB.getUserData() === pocketProps.userData && bB);
    const ball = (fA.getUserData() === ballFixProps.userData && bA)
                  || (fB.getUserData() === ballFixProps.userData && bB);
    setTimeout(() => {
      if (pocket && ball) {
        const { world } = this.props;
        world.destroyBody(ball);
      }
    }, 1);
  }

  render() {
    return (
      <React.Fragment>
        <Table width={WIDTH} height={HEIGHT} pocketRadius={POCKET_R} />
        <Rack ballRadius={BALL_R} offset={new Vec2(WIDTH / 4, 0)} />
      </React.Fragment>
    );
  }
}

const getViewProps = viewProps => config => ({
  ...(typeof viewProps === 'function' ? viewProps(config) : viewProps),
  x: 0,
  y: 0,
  pixelsPerMeter: 100,
  mouseForce: -30,
});

type ContainerProps = {
  viewProps: ViewProps
}

export default ({ viewProps, ...rest }: ContainerProps) => (
  <PlanckContainer {...rest} viewProps={getViewProps(viewProps)}>
    <Context.Consumer>
      {({ world }) => <EightBall world={world} />}
    </Context.Consumer>
  </PlanckContainer>
);
