import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import axios from 'axios';
import './QuoteForm.scss';
import quoteStore from '../../stores/quoteStore'
import Navbar from '../../share-components/Navbar/Navbar';

const QuoteForm = () => {
  const generateQuotes = (e) => {
    axios.post('/quote', quoteStore.quoteInputs)
      .then((response) => {
        const { data } = response;
        quoteStore.quotes = data;
      })
      .catch((error) => {
        alert(`Error: ${error.response.data}`);
      })
  }
  return (
    <div id='quote-form'>
      <button className='btn-primary' onClick={generateQuotes}>Generate Quotes</button>
      <Navbar />
      <CostSummary />
      <InputSection />
      <OutputSection />
    </div>
  );
};

export default QuoteForm;