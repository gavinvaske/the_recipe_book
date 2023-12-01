import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import InputField from './InputField/InputField';

const QuoteInputSection = () => {
  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die />
        </div>
      <div className='right-section'>
        <div className='first-section'>
          <InputField header={'Labels/Roll'} />
          <InputField header={'Designs'} />
          <InputField header={'Markup'} />
        </div>
        <div className='second-section'></div>
        <div className='third-section'></div>
        <div className='fourth-section'></div>
      </div>
    </div>
  )
};

export default QuoteInputSection;