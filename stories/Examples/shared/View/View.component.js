// @flow
import React, { type Node } from 'react';

import Playbar from './Playbar';

type Props = {
  children: Node
}

type State = {
  key: string,
  paused: boolean
}

export default class View extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      key: `child_${new Date().getTime()}`,
      paused: false,
    };
    this.planckProps = {
      viewProps: testbed => {
        this.testbed = testbed;
        return {
          width: 'calc(100% - 2px)',
          height: 'calc(100vh - 40px)',
          _pause: () => this.setState({ paused: true }),
          _resume: () => this.setState({ paused: false }),
        };
      },
    };
  }

  togglePause = () => this.testbed.togglePause();

  reset = () => this.setState({
    key: `child_${new Date().getTime()}`,
    paused: false,
  });

  planckProps: any

  testbed: any

  render() {
    const { children } = this.props;
    const { key, paused } = this.state;
    return (
      <React.Fragment>
        <Playbar
          togglePause={this.togglePause}
          paused={paused}
          reset={this.reset}
        />
        {React.Children.map(children, child => React.cloneElement(child,
          Object.assign(this.planckProps, { key })))}
      </React.Fragment>
    );
  }
}
