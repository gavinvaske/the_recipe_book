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
      <div className='number-of-colors-section'>
        <div className='colors-input-section'>
          {Object.keys(colorToCount).map((color) => (
            <div className={`color-${color}`} onClick={(e) => updateColorCount(color)}>{colorToCount[color]}</div>)
          )}
        </div>
        <div className='colors-output-section'>
        <h1> Sum = {quoteInputs.numberOfColorsOverride} </h1>
        <h3> Unique Colors: {getUniqueColors()} </h3>
        </div>
      </div>

      <div id='reset-colors' onClick={(e) => resetNumberOfColors()}>Reset NumberOfColors</div>
    </>
  );
}