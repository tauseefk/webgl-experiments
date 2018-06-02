import React from 'react';

const RangeSlider = ({ name, min, max, step, value, onSliderMove }) => {
  return (
    <div>
      <input
        id={name}
        type='range'
        min={min}
        step={step}
        max={max}
        onChange={onSliderMove}
        value={value}
      />
      <label htmlFor={name}>{value}</label>
    </div>
  )
};

export default RangeSlider;
