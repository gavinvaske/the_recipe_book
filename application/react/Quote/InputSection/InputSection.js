import React, { useEffect } from 'react';
import './InputSection.scss';
import Die from './DieInput/DieInput'
import Material from './MaterialInput/MaterialInput'
import NumberOfColors from './NumberOfColors/NumberOfColors';
import UnwindDirection from './UnwindDirection/UnwindDirection';
import CheckboxField from './InputFields/CheckboxField/CheckboxField';
import TextField from './InputFields/TextField/TextField';
import axios from 'axios';
import quoteStore from '../../stores/quoteStore';

const QuoteInputSection = () => {
  
//   useEffect(() => {
    // axios.get(`/die/`)
    //   .then((dies) => {
    //       console.log('responseeee (dies):', dies);
    //   })
//       .catch((error) => {
//       console.log('error:', error);
//       });
    // axios.get(`/materials/all`)
    //   .then((materials) => {
    //       console.log('responseeee (materials):', materials);
    //   })
    //   .catch((error) => {
    //   console.log('error:', error);
    //   });
//   });

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setQuoteInputs((quoteInputs) => {
//       console.log(quoteInputs);
//       return {
//         ...quoteInputs, 
//         [name]: value 
//       }
//     })
//   };

//   const toggleBooleanInput = (event) => {
//     const { name } = event.target;
//     setQuoteInputs((quoteInputs) => {
//       console.log(quoteInputs);
//       return {
//       ...quoteInputs,
//         [name]: !quoteInputs[name]
//       }
//     })
//   }

  return (
    <div id='quote-input-section'>
      <div className='left-section'>
        <Die />
        <Material isPrimaryMaterial={true} />
        <Material isPrimaryMaterial={false} />
      </div>
      <div className='right-section'>
        <div className='row-one'>
          <TextField accessor={'labelsPerRollOverride'} header={'Labels/Roll'} onChange={(e) => quoteStore.quoteInputs.labelsPerRollOverride = e.target.value}/>
          <TextField accessor={'numberOfDesignsOverride'} header={'Designs'} onChange={(e) => quoteStore.quoteInputs.numberOfDesignsOverride = e.target.value}/>
          <TextField accessor={'profitMargin'} header={'Markup'} onChange={(e) => quoteStore.quoteInputs.profitMargin = e.target.value}/>
        </div>
        <div className='row-two'>
            <NumberOfColors />
        </div>
        <div className='row-three'>
          <CheckboxField accessor={'reinsertion'} header={'Reinsertion'} onChange={(e) => quoteStore.quoteInputs.reinsertion = !quoteStore.quoteInputs.reinsertion}/>
          <CheckboxField accessor={'isSheeted'} header={'Sheeted'} onChange={(e) => quoteStore.quoteInputs.isSheeted = !quoteStore.quoteInputs.isSheeted}/>
          <CheckboxField accessor={'variableData'} header={'Variable'} onChange={(e) => quoteStore.quoteInputs.variableData = !quoteStore.quoteInputs.variableData}/>
        </div>
        <div className='row-four'>
          <UnwindDirection />
        </div>
      </div>
    </div>
  )
};

export default QuoteInputSection;