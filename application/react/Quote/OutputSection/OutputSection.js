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
      <div className='output-group'>
        <TableRow header={'Initial Stock Length'} data={getAttributeFromQuotes(quotes, 'initialStockLength')} />
        <TableRow header={'Proof Run Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Color Calibration Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Die Cutter Setup Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Print Cleaner Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Scaling Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'New Material Setup Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Die Line Setup Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Stock Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Throw Away Percentage'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Stock MSI'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Rolls of Paper'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Extra Frames'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Frames'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Stock Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Finish Feet'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Finish MSI'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Finish Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Scaling Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Proof Runup Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Print Cleaner Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'.5" Masking Tape'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'2" Packaging Tape'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Tape Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cores'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Core Cost Dollars'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Box Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cost Material'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Stock Splice'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Color Calibration'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Printing Proof Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Reinsertion Setup Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Roll Change Over Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Printing Stock Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Reinsertion Printing Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Print Tear Down'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Time At Printing'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Throw Away Print Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Printing Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Stock-Splice'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Die Setup'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Sheeted Setup'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Stock Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Tear Down'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Sheeted Tear Down'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Time At Cutting'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Diameter'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Throw Away Cutting Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cutting Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Core Gathering Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Change Over Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Winding All Rolls Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Label Delivery To Shipping Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Winding Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Throw Away Winding Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Finished Rolls'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Winding Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cost of Machine Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Box Creation Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Packaging Box Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Packaging Slips Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Boxes'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Material Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Machine Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Shipping Time Cost'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Cost of Job'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Final Quoted Price'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Price Per Unit'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
    </div>
  );
};

export default QuoteOutputSection;