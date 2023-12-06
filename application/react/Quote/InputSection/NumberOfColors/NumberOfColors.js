import React from 'react';
import './NumberOfColors.scss';
import quoteStore from '../../../stores/quoteStore'

export default NumberOfColors = () => {
  return (
  <div className="number-of-colors-section">
    <div>
      <div>Number of Colors:</div>
      <div className='colors-section'>
        <div className='row'>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>
        <div className='row'>
          <div>5</div>
          <div>6</div>
          <div>7</div>
        </div>
      </div>
    </div>
    <div>
      <TextField accessor={'numberOfcolorsOverride'} header={'Number of Colors'} onChange={(e) => quoteStore.quoteInputs.numberOfColorsOverride = e.target.value}></TextField>
      <h3>CMYK</h3>
    </div>
  </div>
  );
}