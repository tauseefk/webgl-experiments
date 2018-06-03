import React, { Component } from 'react';

import RangeSlider from './RangeSlider';
import Canvas from './Canvas';

import Lasso from './Lasso';

export default class DrawingBoard extends Component {

  state = {
    brightness: 0,
    lasso: null,
    isGlobalEdit: true
  }

  componentDidMount() {
    this.setState(() => ({ lasso: new Lasso() }));
  }

  /**
   * Updates the current edit state
   */
  handleEditState = (editState) => {
    this.setState(() => ({ isGlobalEdit: editState }));
  }

  updateBrightness = (e) => {
    const newBrightness = e.target.value;
    this.setState((prevState) => ({ brightness: newBrightness }));
  }

  render() {
    const { lasso, brightness, isGlobalEdit } = this.state;
    return (
      <div>
        <Canvas
          width='512'
          height='512'
          Lasso={lasso}
          brightness={brightness}
          isGlobalEdit={isGlobalEdit}
          updateEditState={this.handleEditState}
        />
        <RangeSlider
          name='brightness'
          min='0'
          max='0.7'
          step='0.01'
          value={this.state.brightness}
          onSliderMove={this.updateBrightness}
        />
        {!isGlobalEdit
          ? <button onClick={() => this.handleEditState(true)}>Done</button>
          : ''}
      </div >
    );
  }
}
