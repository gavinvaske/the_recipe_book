import React from 'react';
import './OutputSection.scss';
import TableRow from '../TableRow/TableRow';

const getAttributeFromQuotes = (quotes, attribute) => {
  return quotes.map(quote => quote[attribute] || 'N/A')
}

const QuoteOutputSection = (props) => {
  const { quotes } = props;

  return (
    <div id='quote-output-section'>
      <TableRow header={'Initial Stock Length'} data={getAttributeFromQuotes(quotes, 'initialStockLength')} />
    </div>
  );
};

export default QuoteOutputSection;