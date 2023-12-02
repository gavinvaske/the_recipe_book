import React from 'react';
import './CostSummary.scss';
import TableRow from '../TableRow/TableRow';
import LabelQtyInputField from './LabelQtyInputField/LabelQtyInputField';

const TODOGetData = (quotes) => {
  return quotes.map((_, index) => index)
}

const QuoteCostSummary = (props) => {
  const { quotes, quoteInputs, setQuoteInputs } = props;

  const getLabelQtyInputChangeHandler = (index) => {
    return (inputEvent) => {
      const { name, value } = inputEvent.target;
      setQuoteInputs((quoteInputs) => {
        quoteInputs.labelQuantities[index] = value;
        console.log(quoteInputs);
        return quoteInputs;
      })
    }
  }

  return (
    <div id='quote-cost-summary'>
      <div className='row'>
        <div></div> {/* This empty column is used for spacing reasons */}
        {quoteInputs.labelQuantities.map((labelQty, index) => 
            <LabelQtyInputField onChange={getLabelQtyInputChangeHandler(index)} />
        )}
      </div>
      <TableRow header={'Production Cost'} data={TODOGetData(quotes)} />
      <TableRow header={'Final Cost'} data={TODOGetData(quotes)} />
      <TableRow header={'Price Per Thousand'} data={TODOGetData(quotes)} />
      <TableRow header={'Profit'} data={TODOGetData(quotes)} />
      <TableRow header={'Price Per Unit'} data={TODOGetData(quotes)} />
    </div>
  )
};

export default QuoteCostSummary;