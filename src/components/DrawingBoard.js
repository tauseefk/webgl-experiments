import React, { Component } from 'react';

import RangeSlider from './RangeSlider';
import BackdropImg from '../backdrop.png';

import { initImageTexture, setupShaders, clear, draw } from './CanvasOperations';

var gl = window.gl;
var texture = null;

export default class DrawingBoard extends Component {

  state = {
    brightness: 0
  }

  canvasElement = React.createRef();

  updateBrightness = (e) => {
    const newBrightness = e.target.value;
    this.setState((prevState) => ({ brightness: newBrightness }));
  }

  updateCanvas = () => {
    if (gl) {
      clear(gl);
      draw(gl, texture);
    }
  }

  componentDidMount() {
    const canvas = this.canvasElement.current;
    gl = canvas.getContext('webgl');
    let img = new Image();
    img.src = BackdropImg;
    img.onload = () => {
      texture = initImageTexture(gl, img);
      setupShaders(gl);
      this.updateCanvas();
    };
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvasElement} width='512' height='512'>This is a canvas</canvas>
        <RangeSlider
          name='brightness'
          min='0'
          max='0.7'
          step='0.01'
          value={this.state.brightness}
          onSliderMove={this.updateBrightness}
        />
      </div >
    );
  }
}
