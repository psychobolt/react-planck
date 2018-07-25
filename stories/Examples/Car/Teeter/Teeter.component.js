// @flow
import React from 'react';
import { Vec2, typeof Body as PlBody } from 'planck-js';

import { Body, Fixture, Box } from 'dist';

type Props = {};

export default class extends React.Component<Props> {
  componentDidMount() {
    this.teeter.applyAngularImpulse(100.0, true);
  }

  setTeeter = (ref: PlBody) => { this.teeter = ref; }

  teeter: PlBody;

  render() {
    return (
      <Body id="teeter" ref={this.setTeeter} type="dynamic" position={new Vec2(140.0, 1.0)}>
        <Fixture density={1.0}>
          <Box hx={10.0} hy={0.25} />
        </Fixture>
      </Body>
    );
  }
}
