import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';

const QuoteForm = () => {
  return (
    <div id='quote-form'>
      <CostSummary />
      <InputSection />
      <OutputSection />
    </div>
  );
};

export default QuoteForm;