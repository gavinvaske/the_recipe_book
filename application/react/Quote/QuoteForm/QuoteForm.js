import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import { useState, useEffect } from 'react';

const NUMBER_OF_QUOTES = 8;
const DEFAULT_LABEL_QUANTITY = 0;
/* Move quotes into useEffect(...) - eventually... */

const QuoteForm = () => {
  const [quotes, setQuotes] = useState([]);
  const [quoteInputs, setQuoteInputs] = useState({ labelQuantities: [0,0,0,0,0,0,0,0] });

  useEffect(() => {
    const labelQuantities = [];

    for (let i=0; i<NUMBER_OF_QUOTES; i++) {
      setQuotes((quotes) => [...quotes, { quoteNumber: i+1}])
      labelQuantities.push(DEFAULT_LABEL_QUANTITY);
    }
    setQuoteInputs((quoteInputs) => ({...quoteInputs, labelQuantities: labelQuantities}));
  }, [])

  return (
    <div id='quote-form'>
      <CostSummary quotes={quotes} quoteInputs={quoteInputs} setQuoteInputs={setQuoteInputs}/>
      <InputSection setQuoteInputs={setQuoteInputs}/>
      <OutputSection quotes={quotes}/>
    </div>
  );
};

export default QuoteForm;