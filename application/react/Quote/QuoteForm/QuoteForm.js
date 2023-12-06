import React from 'react';
import CostSummary from '../CostSummary/CostSummary';
import InputSection from '../InputSection/InputSection';
import OutputSection from '../OutputSection/OutputSection';
import quoteStore from '../../stores/quoteStore'

const QuoteForm = () => {

  return (
    <div id='quote-form'>
      <CostSummary store={quoteStore}/>
      <InputSection />
      <OutputSection quotes={quoteStore.quotes}/>
    </div>
  );
};

export default QuoteForm;