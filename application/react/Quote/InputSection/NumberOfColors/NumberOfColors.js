import React from 'react';
import './NumberOfColors.scss';

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
      <h1>5</h1>
      <h3>CMYK</h3>
    </div>
  </div>
  );
}