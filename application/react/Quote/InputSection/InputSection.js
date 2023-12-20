import React from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import Material from './MaterialInput/MaterialInput'
import NumberOfColors from './NumberOfColors/NumberOfColors';
import UnwindDirection from './UnwindDirection/UnwindDirection';
import CheckboxField from './InputFields/CheckboxField/CheckboxField';
import TextField from './InputFields/TextField/TextField';
import quoteStore from '../../stores/quoteStore';
import FinishInput from './FinishInput/FinishInput';
import LabelsPerRoll from './InputFields/LabelsPerRoll/LabelsPerRoll';

const QuoteInputSection = () => {
  const { quoteInputs } = quoteStore;
  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die />
        <Material isPrimaryMaterial={true} />
        <Material isPrimaryMaterial={false} />
        <FinishInput />
      </div>
      <div className='right-section'>
        <div className='row-one'>
          <div className='card'>
            <TextField accessor={'numberOfDesignsOverride'} header={'Designs'} onChange={(e) => quoteInputs.numberOfDesignsOverride = Number(e.target.value)}/>
          </div>
          <div className='card'>
            <TextField accessor={'profitMargin'} header={'Markup'} onChange={(e) => quoteInputs.profitMargin = Number(e.target.value)}/>
          </div>
        </div>
        <div className='labels-per-roll card flex-center-center-row'>
          <LabelsPerRoll/>
        {/* <div className='card'>
          <TextField accessor={'labelsPerRollOverride'} header={'Labels/Roll'} onChange={(e) => quoteInputs.labelsPerRollOverride = Number(e.target.value)}/>
        </div> */}
        </div>
        <div className='row-two'>
            <NumberOfColors />
        </div>
        <div className='row-four'>
          <UnwindDirection />
        </div>
        <div className='row-three'>
          <CheckboxField accessor={'reinsertion'} header={'Reinsertion'} onChange={(e) => quoteInputs.reinsertion = !quoteInputs.reinsertion}/>
          <CheckboxField accessor={'isSheeted'} header={'Sheeted'} onChange={(e) => quoteInputs.isSheeted = !quoteInputs.isSheeted}/>
          <CheckboxField accessor={'variableData'} header={'Variable'} onChange={(e) => quoteInputs.variableData = !quoteInputs.variableData}/>
        </div>
        <div className='card'>
          <TextField accessor={'coreDiameterOverride'} header={'Core Diameter'} onChange={(e) => quoteInputs.coreDiameterOverride = Number(e.target.value)}/>
        </div>
      </div>
    </div>
  )
};

export default QuoteInputSection;