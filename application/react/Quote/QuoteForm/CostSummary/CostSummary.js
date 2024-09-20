import React from 'react';
import { observer } from 'mobx-react-lite';
import './CostSummary.scss';
import TableRow from '../TableRow/TableRow';
import LabelQtyInputField from './LabelQtyInputField/LabelQtyInputField';
import quoteStore from '../../../stores/quoteStore'
import { currencyFormatter, floatingPointFormatter } from '../../../utils/formatters';

const FOUR_DECIMALS = 4;

const getAttributeFromQuotes = (quotes, attribute) => {
    return quotes.map(quote => quote[attribute]);
  }

const QuoteCostSummary = observer(() => {
  const { quotes } = quoteStore;

  return (
    <div id='quote-cost-summary' className='card'>
      <div className='row'>
        <div className='header'></div> {/* This empty column is used for spacing reasons */}
        {quoteStore.quoteInputs.labelQuantities.map((_, index) =>
            <LabelQtyInputField labelQuantities={quoteStore.quoteInputs.labelQuantities} index={index} />
        )}
      </div>
      <TableRow header={'Production Cost'} data={getAttributeFromQuotes(quotes, 'totalProductionCost')} formatter={currencyFormatter} />
      <TableRow header={'Quoted Price'} data={getAttributeFromQuotes(quotes, 'quotedPrice')}  formatter={currencyFormatter} />
      <TableRow header={'Price Per Thousand'} data={getAttributeFromQuotes(quotes, 'pricePerThousand')}  formatter={currencyFormatter} />
      <TableRow header={'Profit'} data={getAttributeFromQuotes(quotes, 'profit')} formatter={currencyFormatter} />
      <TableRow header={'Price Per Label'} data={getAttributeFromQuotes(quotes, 'pricePerLabel')} formatter={floatingPointFormatter(FOUR_DECIMALS)} />
    </div>
  )
});

export default QuoteCostSummary;