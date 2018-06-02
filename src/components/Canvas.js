import React, { Component } from 'react';

import BackdropImg from '../backdrop.png';

import { initImageTexture, setupShaders, clear, draw } from './CanvasOperations';
import Utils from './Utils';

var DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

export default class Canvas extends Component {
  state = {
    canvas: null,
    glContext: null,
    imageTexture: null,
    shaderProgram: null,
    boundingRect: null
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
    const { canvas, boundingRect } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: (e.clientX - boundingRect.left) / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -((e.clientY - boundingRect.top) / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseDown(mousePosition.x, mousePosition.y);
  }

  handleMouseMove = (e) => {
    const { canvas, boundingRect } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: (e.clientX - boundingRect.left) / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -((e.clientY - boundingRect.top) / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseMove(mousePosition.x, mousePosition.y);
  }

  handleMouseUp = (e) => {
    const { glContext } = this.state;
    const { Lasso } = this.props;
    const selectionPoints = Utils.concatAll(Lasso.getMousePositions()
      .map(point => {
        return [point.x, point.y];
      }));

    // XXX:TODO clean this up
    let buffer = glContext.createBuffer(glContext.ARRAY_BUFFER);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(selectionPoints), glContext.STATIC_DRAW);
    glContext.enableVertexAttribArray(0);

    glContext.vertexAttribPointer(0, 2, glContext.FLOAT, false, 0, 0);
    glContext.drawArrays(glContext.TRIANGLE_FAN, 0, selectionPoints.length / 2);
  }

  componentDidMount() {
    let gl = this.canvasElement.current.getContext('webgl');
    //XXX:TODO check if gl exists and show banner if it doesn't

    this.setState((prevState) => ({
      glContext: gl,
      canvas: this.canvasElement.current,
      boundingRect: this.canvasElement.current.getBoundingClientRect()
    }),
      () => {
        const program = setupShaders(this.state.glContext);
        this.setState(() => ({ shaderProgram: program }));
        this.loadImageAsTexture();
      });
  }

  componentDidUpdate() {
    const { glContext, shaderProgram } = this.state;
    const { brightness } = this.props;
    if (!glContext || !shaderProgram) return;
    // XXX:TODO abstract webgl calls out of the component, move to canvas operations
    var uBrightness = glContext.getUniformLocation(shaderProgram, 'uBrightness');
    glContext.uniform1f(uBrightness, brightness);
    this.updateCanvasContent();
  }

  componentWillUnmount() {
    // XXX:TODO clean up the glContext
    const { shaderProgram, glContext } = this.state;
    glContext.bindTexture(glContext.TEXTURE_2D, null);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.deleteProgram(shaderProgram);
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref={this.canvasElement}
        width={width}
        height={height}>
      </canvas>
    );
  }
}
