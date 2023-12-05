import React, { useEffect } from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import Material from './MaterialInput/MaterialInput'
import NumberOfColors from './NumberOfColors/NumberOfColors';
import UnwindDirection from './UnwindDirection/UnwindDirection';
import CheckboxField from './InputFields/CheckboxField/CheckboxField';
import TextField from './InputFields/TextField/TextField';
import axios from 'axios';

const QuoteInputSection = (props) => {
  const { setQuoteInputs } = props;
  
  useEffect(() => {
    axios.get(`/die/`)
      .then((dies) => {
          console.log('responseeee (dies):', dies);
      })
      .catch((error) => {
      console.log('error:', error);
      });
    axios.get(`/materials/all`)
      .then((materials) => {
          console.log('responseeee (materials):', materials);
      })
      .catch((error) => {
      console.log('error:', error);
      });
  });

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

  const toggleBooleanInput = (event) => {
    const { name } = event.target;
    setQuoteInputs((quoteInputs) => {
      console.log(quoteInputs);
      return {
      ...quoteInputs,
        [name]: !quoteInputs[name]
      }
    })
  }

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
          <TextField accessor={'labelsPerRollOverride'} header={'Labels/Roll'} onChange={handleInputChange} />
          <TextField accessor={'numberOfDesignsOverride'} header={'Designs'} onChange={handleInputChange} />
          <TextField accessor={'profitMargin'} header={'Markup'} onChange={handleInputChange} />
        </div>
        <div className='row-two'>
            <NumberOfColors />
        </div>
        <div className='row-three'>
          <CheckboxField accessor={'reinsertion'} header={'Reinsertion'} onChange={toggleBooleanInput} />
          <CheckboxField accessor={'isSheeted'} header={'Sheeted'} onChange={toggleBooleanInput} />
          <CheckboxField accessor={'variableData'} header={'Variable'} onChange={toggleBooleanInput} />
        </div>
        <div className='row-four'>
          <UnwindDirection />
        </div>
      </div>
    </div>
  )
};

export default QuoteInputSection;