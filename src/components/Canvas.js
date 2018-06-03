import React, { Component } from 'react';

import BackdropImg from '../backdrop.png';

import {
  initImageTexture,
  setupShaders,
  clear,
  draw,
  drawSelectionToTexture,
  drawTexture,
  updateSelectionState
} from './CanvasOperations';

import Utils from './Utils';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

const selectionStateEnum = {
  SELECTION_PROCESSING: 1,
  SELECTED: 2
}

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
    const { canvas, glContext, shaderProgram, boundingRect } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: (e.clientX - boundingRect.left) / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -((e.clientY - boundingRect.top) / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseDown(mousePosition.x, mousePosition.y);

    updateSelectionState(glContext,
      shaderProgram,
      selectionStateEnum.SELECTION_PROCESSING);
  }

  handleMouseMove = (e) => {
    const { canvas, boundingRect, glContext } = this.state;
    const { Lasso } = this.props;
    const mousePosition = {
      x: (e.clientX - boundingRect.left) / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -((e.clientY - boundingRect.top) / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseMove(mousePosition.x, mousePosition.y);
    const selectionPoints = Utils.concatAll(Lasso.getMousePositions()
      .map(point => {
        return [point.x, point.y];
      }));
    let rTT = drawSelectionToTexture(glContext, selectionPoints);
    drawTexture(glContext, rTT);
  }

  handleMouseUp = (e) => {
    const { canvas, boundingRect, glContext, shaderProgram } = this.state;
    const { Lasso } = this.props;

    const mousePosition = {
      x: (e.clientX - boundingRect.left) / canvas.width * DEVICE_PIXEL_RATIO - 1,
      y: -((e.clientY - boundingRect.top) / canvas.height * DEVICE_PIXEL_RATIO - 1)
    }
    Lasso.onMouseUp(mousePosition.x, mousePosition.y);

    updateSelectionState(glContext,
      shaderProgram,
      selectionStateEnum.SELECTED);

    const selectionPoints = Utils.concatAll(Lasso.getMousePositions()
      .map(point => {
        return [point.x, point.y];
      }));
    drawSelectionToTexture(glContext, selectionPoints);
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
