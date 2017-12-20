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
  stage: Stage
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
      if (this.canvas) {
        this.resize(this.canvas);
      }
      return this.props.world;
    });
  }

  componentDidUpdate() {
    if (this.canvas && this.config) {
      this.resize(this.canvas);
    }
  }

  componentWillUnmount() {
    const { config } = this;
    if (config) {
      Object.keys(config).forEach(key => { config[key] = null; });
      this.config = null;
    }
  }

  setCanvas = (ref: ?HTMLCanvasElement) => { this.canvas = ref; }

  resize(canvas: HTMLCanvasElement) {
    const { width, height, pixelsPerMeter, getTestbedProps, world, ...rest } = this.props;
    const props = getTestbedProps ? getTestbedProps(this.config) : {};
    const { stage } = this.config;
    const { clientWidth: w, clientHeight: h } = canvas;
    const context = canvas.getContext('2d');
    Object.assign(canvas, { width: w, height: h });
    stage.viewport(w, h, 1);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, w, h);
    stage.render(context);
    Object.assign(this.config, rest, {
      width: w / pixelsPerMeter,
      height: h / pixelsPerMeter,
      ratio: pixelsPerMeter,
    }, props);
  }

  canvas: ?HTMLCanvasElement
  config: ?Config;

  render() {
    const { width, height } = this.props;
    return <canvas id="stage" ref={this.setCanvas} style={{ width, height }} />;
  }
}
