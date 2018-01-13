// @flow
import React from 'react';
import typeof Stage from 'stage-js';
import type { World } from 'planck-js';

import testbed from './testbed';

export type PropsWithStage = (stage: Stage) => {}

export type Props = {
  width: string | number,
  height: string | number,
  pixelsPerMeter: number,
  world: World,
}

type Config = {
  width: number,
  height: number,
  ratio: number,
  stage: Stage,
  destroy: () => void,
  paused: () => void,
  isPaused: () => boolean,
}

function getProps(props, config) {
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
      const { width, height, ...rest } = getProps(this.props, this.config);
      this.config = Object.assign(config, rest);
      if (this.canvas) {
        this.resizeContext(this.canvas);
      }
      this.forceUpdate();
      return this.props.world;
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.canvas && this.config) {
      const { width, height, ...rest } = getProps(this.props, this.config);
      Object.assign(this.config, rest);
      if (width !== prevProps.width || height !== prevProps.height) {
        this.resizeContext(this.canvas);
      }
    }
  }

  componentWillUnmount() {
    if (this.config) {
      this.config.destroy();
      this.config = null;
    }
  }

  setCanvas = (ref: ?HTMLCanvasElement) => { this.canvas = ref; }

  resizeContext(canvas: HTMLCanvasElement) {
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
    const { width, height } = getProps(this.props, this.config);
    return <canvas id="stage" ref={this.setCanvas} style={{ width, height }} />;
  }
}
