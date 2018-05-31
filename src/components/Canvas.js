import React, { Component } from 'react';

import BackdropImg from '../backdrop.png';

import { initImageTexture, setupShaders, clear, draw } from './CanvasOperations';

var DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

export default class Canvas extends Component {
  state = {
    canvas: null,
    glContext: null,
    imageTexture: null
  }
  canvasElement = React.createRef();

  loadImageAsTexture = () => {
    let img = new Image();
    img.src = BackdropImg;
    img.onload = () => {
      let texture = initImageTexture(this.state.glContext, img);
      this.setState(() => ({ imageTexture: texture }),
        this.updateCanvasContent);
    };
  }

  updateCanvasContent = () => {
    clear(this.state.glContext);
    draw(this.state.glContext, this.state.imageTexture);
  }

  handleMouseDown = (e) => {
    const { canvas } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: e.clientX / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -(e.clientY / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseDown(mousePosition.x, mousePosition.y);
  }

  handleMouseMove = (e) => {
    const { canvas } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: e.clientX / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -(e.clientY / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseMove(mousePosition.x, mousePosition.y);
  }

  componentDidMount() {
    let gl = this.canvasElement.current.getContext('webgl');
    //XXX:TODO check if gl exists and show banner if it doesn't

    this.setState((prevState) => ({
      glContext: gl,
      canvas: this.canvasElement.current
    }),
      () => {
        setupShaders(this.state.glContext);
        this.loadImageAsTexture();
      });
  }
  render() {
    const { width, height, Lasso } = this.props;
    return (
      <canvas
        onMouseDown={this.handleMouseDown}
        onMouseUp={() => console.log(Lasso.getMousePositions())}
        onMouseMove={this.handleMouseMove}
        ref={this.canvasElement}
        width={width}
        height={height}>
      </canvas>
    );
  }
}
