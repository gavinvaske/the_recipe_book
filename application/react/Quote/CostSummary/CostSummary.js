import React from 'react';
import './CostSummary.scss';
import TableRow from './TableRow';

const TODOGetData = (quotes) => {
  return quotes.map((_, index) => index)
}

const QuoteCostSummary = (props) => {
  const { quotes } = props;

  return (
    <div id='quote-cost-summary'>
      <TableRow header={'Production Cost'} data={TODOGetData(quotes)} />
      <TableRow header={'Final Cost'} data={TODOGetData(quotes)} />
      <TableRow header={'Price Per Thousand'} data={TODOGetData(quotes)} />
      <TableRow header={'Profit'} data={TODOGetData(quotes)} />
      <TableRow header={'Price Per Unit'} data={TODOGetData(quotes)} />
    </div>
  )
};

export default QuoteCostSummary;