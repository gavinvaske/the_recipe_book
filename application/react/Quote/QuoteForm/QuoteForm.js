import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import axios from 'axios';
import './QuoteForm.scss';
import quoteStore from '../../stores/quoteStore'

const QuoteForm = () => {
  const generateQuotes = (e) => {
    axios.post('/quote', quoteStore.quoteInputs)
      .then((response) => {
        const { data } = response;
        quoteStore.quotes = data;
      })
  }
  return (
    <div id='quote-form'>
      <button className='btn-primary' onClick={generateQuotes}>Generate Quotes</button>
      <CostSummary/>
      <InputSection/>
      <OutputSection/>
    </div>
  );
};

export default QuoteForm;