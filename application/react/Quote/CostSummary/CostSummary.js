import React from 'react';
import './CostSummary.scss';
import TableRow from '../TableRow/TableRow';
import LabelQtyInputField from './LabelQtyInputField/LabelQtyInputField';

const QuoteCostSummary = (props) => {
  const { store } = props;

  return (
    <div id='quote-cost-summary'>
      <div className='row'>
        <div></div> {/* This empty column is used for spacing reasons */}
        {store.quoteInputs.labelQuantities.map((_, index) =>
            <LabelQtyInputField labelQuantities={store.quoteInputs.labelQuantities} index={index} />
        )}
      </div>
      <TableRow header={'Production Cost'} data={store.quotes.map((quote) => quote.productionCost || '-')} />
      <TableRow header={'Final Cost'} data={store.quotes.map((quote) => quote.finalCost || '-')} />
      <TableRow header={'Price Per Thousand'} data={store.quotes.map((quote) => quote.pricePerThousand || '-')} />
      <TableRow header={'Profit'} data={store.quotes.map((quote) => quote.profit || '-')} />
      <TableRow header={'Price Per Unit'} data={store.quotes.map((quote) => quote.pricePerUnit || '-')} />
    </div>
  )
};

export default QuoteCostSummary;