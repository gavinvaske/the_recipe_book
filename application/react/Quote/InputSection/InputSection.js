import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import InputField from './InputField/InputField';

const QuoteInputSection = (props) => {
  const { setQuoteInputs } = props;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuoteInputs((quoteInputs) => {
      console.log(quoteInputs);
      return {
        ...quoteInputs, 
        [name]: value 
      }
    })
  };

  const handleDieInputChange = (event) => {
    const { name, value } = event.target;
    setQuoteInputs((quoteInputs) => {
      console.log(quoteInputs);
      return {
       ...quoteInputs,
       dieOverride: {
        ...quoteInputs.dieOverride,
         [name]: value 
       }
      }
    })
  }

  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die onChange={handleDieInputChange}/>
      </div>
      <div className='right-section'>
        <div className='first-section'>
          <InputField accessor={'labelsPerRoll'} header={'Labels/Roll'} onChange={handleInputChange} />
          <InputField accessor={'numberOfDesigns'} header={'Designs'} onChange={handleInputChange} />
          <InputField accessor={'profitMargin'} header={'Markup'} onChange={handleInputChange} />
        </div>
        <div className='second-section'></div>
        <div className='third-section'></div>
        <div className='fourth-section'></div>
      </div>
    </div>
  )
};

export default QuoteInputSection;