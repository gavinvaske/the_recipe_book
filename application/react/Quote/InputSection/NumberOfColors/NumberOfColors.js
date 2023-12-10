import React, { useState} from 'react';
import './NumberOfColors.scss';
import quoteStore from '../../../stores/quoteStore'

export default NumberOfColors = () => {
  const DEFAULT_COLOR_TO_COUNT = {
    'C': 0,
    'M': 0,
    'Y': 0,
    'K': 0,
    'W': 0,
    'O': 0,
    'V': 0,
  }
  const { quoteInputs } = quoteStore;
  const [colorToCount, setColorToCount] = useState(DEFAULT_COLOR_TO_COUNT)

  const updateColorCount = (color) => {
    console.log('updating color! -> ', color)
    colorToCount[color] = colorToCount[color] + 1;

    setColorToCount({ ...colorToCount })
    const colorCount = getNumberOfColors();
    quoteInputs.numberOfColorsOverride = colorCount;
  }

  const getNumberOfColors = () => {
    return Object.values(colorToCount).reduce((sum, current) => {
      return sum + current
    }, 0)
  }

  const getUniqueColors = () => {
    return Object.keys(colorToCount).filter((color) => colorToCount[color] > 0).join(' ')
  }

  const resetNumberOfColors = () => {
    setColorToCount({...DEFAULT_COLOR_TO_COUNT});
    quoteInputs.numberOfColorsOverride = undefined;
  }



  return (
    <>
      <div className='number-of-colors-section card'>
        <div class='left-col half-width flex-center-left-row'>
          <div className='colors-input-section'>
            <span>Number of Colors:</span>
            {Object.keys(colorToCount).map((color) => (
              <div className={`color-${color} color-indicator`} onClick={(e) => updateColorCount(color)}>{colorToCount[color]}</div>)
            )}
            <div id='reset-colors' onClick={(e) => resetNumberOfColors()}>x</div>
          </div>
        </div>
        <div className='right-col half-width text-center flex-center-center-column'>
          <span id='totalColorHits'>{quoteInputs.numberOfColorsOverride} </span>
          <span className='color-letter-indicator'>{getUniqueColors()} </span>
        </div>
      </div>

      
    </>
  );
}