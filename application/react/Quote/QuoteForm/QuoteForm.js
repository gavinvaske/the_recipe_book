import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import axios from 'axios';
import './QuoteForm.scss';
import quoteStore from '../../stores/quoteStore'

const QuoteForm = () => {
  const submitQuote = () => {
    axios.post('/quote', quoteStore.quoteInputs)
      .then((response) => {
        const { data } = response;
        console.log('data from POST /quote:', data);
      })
  }
  return (
    <div id='quote-form'>
      <button class='btn-primary' style={{width: '100px'}} onClick={submitQuote}>Imma button</button>
      <CostSummary/>
      <InputSection/>
      <OutputSection/>
    </div>
  );
};

export default QuoteForm;