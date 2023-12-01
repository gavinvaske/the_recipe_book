import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import { useState } from 'react';

/* Move quotes into useEffect(...) - eventually... */
const quotes = [
    { quoteNumber: 1},
    { quoteNumber: 2},
    { quoteNumber: 3},
    { quoteNumber: 4},
    { quoteNumber: 5},
    { quoteNumber: 6},
    { quoteNumber: 7},
];

const QuoteForm = () => {
  return (
    <div id='quote-form'>
      <CostSummary quotes={quotes}/>
      <InputSection />
      <OutputSection />
    </div>
  );
};

export default QuoteForm;