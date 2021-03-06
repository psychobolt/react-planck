// @flow
import React from 'react';
import { Resizable } from 're-resizable';
import { Vec2 } from 'planck-js';

import { PlanckContainer, Body, Fixture, Box } from 'react-planck';

type Props = {
  width?: string,
  height?: string,
  ratio: number
}

type State = {
  width?: string,
  height?: string,
}

export default class extends React.Component<Props, State> {
  static defaultProps = {
    width: 'calc(100% - 2px)',
    height: 'calc(100vh - 40px)',
  }

  constructor(props: Props) {
    super(props);
    const { width, height } = this.props;
    this.state = { width, height };
  }

  onResizeStop = (event: any, direction: any, refToElement: HTMLDivElement) => {
    this.setState({
      width: `${refToElement.clientWidth}px`,
      height: `${refToElement.clientHeight}px`,
    });
  }

  onMouseDown = (fixture: any) => {
    if (fixture) {
      console.log(`Body ${fixture.getBody().getUserData().$$id} is selected!`); // eslint-disable-line no-console
    }
  }

  onMouseUp = () => console.log('Nothing is selected!'); // eslint-disable-line no-console

  render() {
    const { width, height } = this.state;
    const { ratio } = this.props;
    return (
      <div style={{ width, height }}>
        <Resizable onResizeStop={this.onResizeStop}>
          <PlanckContainer
            viewProps={{
              width,
              height,
              pixelsPerMeter: ratio,
              onMouseDown: this.onMouseDown,
              onMouseUp: this.onMouseUp,
              x: 0,
              y: 0,
            }}
          >
            <Body id="box">
              <Fixture density={0.0}>
                <Box position={new Vec2(0.0, 0.0)} hx={1.0} hy={1.0} />
              </Fixture>
            </Body>
          </PlanckContainer>
        </Resizable>
      </div>
    );
  }
}
