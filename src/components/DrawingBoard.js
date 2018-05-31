import React, { Component } from 'react';

import RangeSlider from './RangeSlider';
import Canvas from './Canvas';

import Lasso from './Lasso';

export default class DrawingBoard extends Component {

  state = {
    brightness: 0,
    lasso: null
  }

  componentDidMount() {
    this.setState(() => ({ lasso: new Lasso() }));
  }

  updateBrightness = (e) => {
    const newBrightness = e.target.value;
    this.setState((prevState) => ({ brightness: newBrightness }));
  }

  render() {
    const { lasso, brightness } = this.state;
    return (
      <div>
        <Canvas
          width='512'
          height='512'
          Lasso={lasso}
          brightness={brightness}
        />
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
