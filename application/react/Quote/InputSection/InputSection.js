import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import Material from './MaterialInput/MaterialInput'
import NumberOfColors from './NumberOfColors/NumberOfColors';
import UnwindDirection from './UnwindDirection/UnwindDirection';
import CheckboxField from './InputFields/CheckboxField/CheckboxField';
import TextField from './InputFields/TextField/TextField';
import quoteStore from '../../stores/quoteStore';

const QuoteInputSection = () => {
  const { quoteInputs } = quoteStore;
  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die />
        <Material isPrimaryMaterial={true} />
        <Material isPrimaryMaterial={false} />
      </div>
      <div className='right-section'>
        <div className='row-one'>
          <TextField accessor={'labelsPerRollOverride'} header={'Labels/Roll'} onChange={(e) => quoteInputs.labelsPerRollOverride = e.target.value}/>
          <TextField accessor={'numberOfDesignsOverride'} header={'Designs'} onChange={(e) => quoteInputs.numberOfDesignsOverride = e.target.value}/>
          <TextField accessor={'profitMargin'} header={'Markup'} onChange={(e) => quoteInputs.profitMargin = e.target.value}/>
        </div>
        <div className='row-two'>
            <NumberOfColors />
        </div>
        <div className='row-three'>
          <CheckboxField accessor={'reinsertion'} header={'Reinsertion'} onChange={(e) => quoteInputs.reinsertion = !quoteInputs.reinsertion}/>
          <CheckboxField accessor={'isSheeted'} header={'Sheeted'} onChange={(e) => quoteInputs.isSheeted = !quoteInputs.isSheeted}/>
          <CheckboxField accessor={'variableData'} header={'Variable'} onChange={(e) => quoteInputs.variableData = !quoteInputs.variableData}/>
        </div>
        <div className='row-four'>
          <UnwindDirection />
        </div>
      </div>
    </div>
  )
};

export default QuoteInputSection;