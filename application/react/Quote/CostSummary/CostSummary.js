import React from 'react';
import './CostSummary.scss';
import TableRow from '../TableRow/TableRow';
import LabelQtyInputField from './LabelQtyInputField/LabelQtyInputField';
import quoteStore from '../../stores/quoteStore'

const QuoteCostSummary = () => {
  return (
    <div id='quote-cost-summary' className='card'>
      <div className='row'>
        <div className='header'></div> {/* This empty column is used for spacing reasons */}
        {quoteStore.quoteInputs.labelQuantities.map((_, index) =>
            <LabelQtyInputField labelQuantities={quoteStore.quoteInputs.labelQuantities} index={index} />
        )}
      </div>
      <TableRow header={'Production Cost'} data={quoteStore.quotes.map((quote) => quote.productionCost || '-')} />
      <TableRow header={'Final Cost'} data={quoteStore.quotes.map((quote) => quote.finalCost || '-')} />
      <TableRow header={'Price Per Thousand'} data={quoteStore.quotes.map((quote) => quote.pricePerThousand || '-')} />
      <TableRow header={'Profit'} data={quoteStore.quotes.map((quote) => quote.profit || '-')} />
      <TableRow header={'Price Per Unit'} data={quoteStore.quotes.map((quote) => quote.pricePerUnit || '-')} />
    </div>
  )
};

export default QuoteCostSummary;