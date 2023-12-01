import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import InputField from './InputField/InputField';

const QuoteInputSection = () => {
  return (
    <div id='quote-input-section'>
      <div class='left-section'>
        <Die />
        </div>
      <div class='right-section'>
        <div class='first-section'>
          <InputField header={'Labels/Roll'} />
          <InputField header={'Designs'} />
          <InputField header={'Markup'} />
        </div>
        <div class='second-section'></div>
        <div class='third-section'></div>
        <div class='fourth-section'></div>
      </div>
    </div>
  )
};

export default QuoteInputSection;