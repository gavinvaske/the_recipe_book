import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import Material from './MaterialInput/MaterialInput'
import InputField from './InputField/InputField';
import NumberOfColors from './NumberOfColors/NumberOfColors';
import UnwindDirection from './UnwindDirection/UnwindDirection';

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

  const handlePrimaryMaterialInputChange = (event) => {
    const { name, value } = event.target;

    setQuoteInputs((quoteInputs) => {
      console.log(quoteInputs);
      return {
      ...quoteInputs,
       primaryMaterialOverride: {
       ...quoteInputs.primaryMaterialOverride,
         [name]: value 
       }
      }
    })
  }

  const handleSecondaryMaterialInputChange = (event) => {
    const { name, value } = event.target;

    setQuoteInputs((quoteInputs) => {
      console.log(quoteInputs);
      return {
     ...quoteInputs,
       secondaryMaterialOverride: {
      ...quoteInputs.secondaryMaterialOverride,
         [name]: value 
       }
      }
    })
  };

  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die onChange={handleDieInputChange}/>
        <Material isPrimaryMaterial={true} onChange={handlePrimaryMaterialInputChange}/>
        <Material isPrimaryMaterial={false} onChange={handleSecondaryMaterialInputChange}/>
      </div>
      <div className='right-section'>
        <div className='row-one'>
          <InputField accessor={'labelsPerRoll'} header={'Labels/Roll'} onChange={handleInputChange} />
          <InputField accessor={'numberOfDesigns'} header={'Designs'} onChange={handleInputChange} />
          <InputField accessor={'profitMargin'} header={'Markup'} onChange={handleInputChange} />
        </div>
        <div className='row-two'>
            <NumberOfColors />
        </div>
        <div className='row-three'>
          <InputField accessor={'TODO'} header={'Reinsertion'} inputFieldType={'checkbox'} onChange={handleInputChange} />
          <InputField accessor={'TODO'} header={'Sheeted'} inputFieldType={'checkbox'} onChange={handleInputChange} />
          <InputField accessor={'TODO'} header={'Variable'} inputFieldType={'checkbox'} onChange={handleInputChange} />
        </div>
        <div className='row-four'>
          <UnwindDirection />
        </div>
      </div>
    </div>
  )
};

export default QuoteInputSection;