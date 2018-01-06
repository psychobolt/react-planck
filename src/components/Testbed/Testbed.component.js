// @flow
import React from 'react';
import typeof Stage from 'stage-js';
import type { World } from 'planck-js';

import testbed from './testbed';

export type PropsWithStage = (stage: Stage) => {}

export type Props = {
  width: string,
  height: string,
  pixelsPerMeter: number,
  world: World,
  getTestbedProps: PropsWithStage
}

type Config = {
  width: number,
  height: number,
  ratio: number,
  stage: Stage,
  paused: () => void,
  isPaused: () => boolean,
}

export default class Testbed extends React.Component<Props> {
  static defaultProps = {
    width: '680px',
    height: '480px',
    pixelsPerMeter: 10,
  }

  componentDidMount() {
    testbed(config => {
      this.config = config;
      const { width, height, getTestbedProps, world, ...rest } = this.props;
      Object.assign(
        this.config,
        Object.assign({}, rest, getTestbedProps ? getTestbedProps(this.config) : {}),
      );
      if (this.canvas) {
        this.resize(this.canvas);
      }
      return this.props.world;
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.canvas && this.config) {
      const { width, height, getTestbedProps, world, ...rest } = this.props;
      const props = Object.assign({}, rest, getTestbedProps ? getTestbedProps(this.config) : {});
      if (Object.entries(props).some(([key, value]) => this.config[key] !== value)) {
        Object.assign(this.config, props);
      }
      if (width !== prevProps.width || height !== prevProps.height) this.resize(this.canvas);
    }
  }

  componentWillUnmount() {
    const { config } = this;
    if (config) {
      this.config.unbindEvents();
      Object.keys(config).forEach(key => { config[key] = null; });
      this.config = null;
    }
  }

  setCanvas = (ref: ?HTMLCanvasElement) => { this.canvas = ref; }

  resize(canvas: HTMLCanvasElement) {
    const { pixelsPerMeter } = this.props;
    const { stage, pause, isPaused } = this.config;
    const { clientWidth: w, clientHeight: h } = canvas;
    const context = canvas.getContext('2d');
    const paused = isPaused();
    Object.assign(canvas, { width: w, height: h });
    stage.viewport(w, h, 1);
    if (paused) pause();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, w, h);
    stage.render(context);
    Object.assign(this.config, {
      width: w / pixelsPerMeter,
      height: h / pixelsPerMeter,
      ratio: pixelsPerMeter,
    });
  }

  canvas: ?HTMLCanvasElement
  config: ?Config;

  render() {
    const { width, height } = this.props;
    return <canvas id="stage" ref={this.setCanvas} style={{ width, height }} />;
  }
}
