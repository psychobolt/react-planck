// @flow
import React from 'react';
import typeof Stage from 'stage-js';
import type { World } from 'planck-js';

import testbed from './testbed';

export type PropsWithStage = (stage: Stage) => {}

export type Props = {
  width: string | number,
  height: string | number,
  world: World,
}

type Config = {
  width: number,
  height: number,
  ratio: number,
  stage: Stage,
  destroy: () => void,
  pause: () => void,
  isPaused: () => boolean,
}

function getProps(props: any, config: any): any {
  const { getTestbedProps, world, ...rest } = props;
  return Object.assign({}, rest, config && getTestbedProps ? getTestbedProps(config) : {});
}

export default class Testbed extends React.Component<Props> {
  static defaultProps = {
    width: '680px',
    height: '480px',
    pixelsPerMeter: 10,
  }

  componentDidMount() {
    testbed(config => {
      const { width, height, pixelsPerMeter, ...rest } = getProps(this.props, config);
      this.config = Object.assign(config, rest, { ratio: pixelsPerMeter });
      if (this.canvas) {
        this.resize(this.canvas, this.config);
      }
      return this.props.world;
    });
  }

  componentDidUpdate(props: Props) {
    if (this.canvas && this.config) {
      const prevProps = getProps(props, this.config);
      const { width, height, pixelsPerMeter, ...rest } = getProps(this.props, this.config);
      Object.assign(this.config, rest, { ratio: pixelsPerMeter });
      if (width !== prevProps.width || height !== prevProps.height) {
        this.resize(this.canvas, this.config);
      }
    }
  }

  componentWillUnmount() {
    if (this.canvas) {
      Object.assign(this.canvas, { width: 0, height: 0 });
    }
    if (this.config) {
      this.config.destroy();
      this.config = null;
    }
  }

  setCanvas = (ref: ?HTMLCanvasElement) => { this.canvas = ref; }

  resize(canvas: HTMLCanvasElement, config: Config) {
    const { pixelsPerMeter } = getProps(this.props, config);
    const { stage, pause, isPaused } = config;
    const { clientWidth, clientHeight } = canvas;
    const paused = isPaused();
    Object.assign(canvas, { width: clientWidth, height: clientHeight });
    stage.viewport(clientWidth, clientHeight, 1);
    if (paused) pause();
    Object.assign(config, {
      width: clientWidth / pixelsPerMeter,
      height: clientHeight / pixelsPerMeter,
    });
  }

  canvas: ?HTMLCanvasElement
  config: ?Config;

  render() {
    const { width, height } = getProps(this.props, this.config || {});
    return <canvas id="stage" ref={this.setCanvas} style={{ width, height }} />;
  }
}
