// @flow
import * as React from 'react';
import typeof { World } from 'planck-js';

import { diffProps, updateProps } from './Planck.component';
import PlanckRenderer from './Planck.renderer';
import PlanckProvider from './Planck.provider'; // eslint-disable-line no-unused-vars
import { CONSTANTS } from './Planck.types';
import type { Props as TestbedProps, PropsWithStage } from './components/Testbed';

const Testbed = React.lazy(() => import('./components/Testbed'));
const { Suspense } = React;

export type ViewProps = TestbedProps | PropsWithStage;

export type Props = {
  world: World,
  worldProps: {},
  testbedProps?: {},
  view?: React.ComponentType<any>,
  viewProps: ViewProps,
  renderer: typeof PlanckRenderer,
  children?: React.Node,
};

// $FlowFixMe
@PlanckProvider
class PlanckContainer extends React.Component<Props> {
  static defaultProps = {
    testbedProps: {},
    view: Testbed,
    children: null,
  };

  mountNode: Object;

  constructor(props: Props) {
    super(props);
    const { world, renderer } = this.props;
    this.mountNode = renderer.reconciler.createContainer(world);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(props: Props) {
    const { world, worldProps } = this.props;
    const updatePayload = diffProps(props.worldProps, worldProps);
    if (updatePayload && updatePayload.length) {
      updateProps(
        world,
        updatePayload,
        CONSTANTS.World,
        props.worldProps,
        worldProps,
      );
    }
    this.update();
  }

  componentWillUnmount() {
    const { renderer } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
  }

  update = () => {
    const { renderer, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this);
  };

  render() {
    const { view: View, viewProps, world } = this.props;
    if (!View) return null;
    if (View === Testbed) {
      const props = typeof viewProps === 'function' ? { getTestbedProps: viewProps } : viewProps;
      return (<Suspense fallback={<div />}><View {...props} world={world} /></Suspense>);
    }
    return <View {...viewProps} world={world} />;
  }
}

export default React.forwardRef((props, ref) => (
  <PlanckContainer {...props} innerRef={ref} />
));
