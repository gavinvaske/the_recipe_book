import React from 'react';
import './OutputSection.scss';
import TableRow from '../TableRow/TableRow';
import quoteStore from '../../stores/quoteStore'
import { observer } from 'mobx-react-lite';

const getAttributeFromQuotes = (quotes, attribute) => {
  return quotes.map(quote => quote[attribute] || '-')
}

const QuoteOutputSection = observer(() => {
  const { quotes } = quoteStore;

  return (
    <div id='quote-output-section'>
      <div className='output-group'>
        <TableRow header={'Initial Stock Length'} data={getAttributeFromQuotes(quotes, 'initialStockLength')} />
        <TableRow header={'Proof Run Feet'} data={getAttributeFromQuotes(quotes, 'proofRunupFeet')} />
        <TableRow header={'Color Calibration Feet'} data={getAttributeFromQuotes(quotes, 'colorCalibrationFeet')} />
        <TableRow header={'Die Cutter Setup Feet'} data={getAttributeFromQuotes(quotes, 'dieCutterSetupFeet')} />
        <TableRow header={'Print Cleaner Feet'} data={getAttributeFromQuotes(quotes, 'printCleanerFeet')} />
        <TableRow header={'Scaling Feet'} data={getAttributeFromQuotes(quotes, 'scalingFeet')} />
        <TableRow header={'New Material Setup Feet'} data={getAttributeFromQuotes(quotes, 'newMaterialSetupFeet')} />
        <TableRow header={'Die Line Setup Feet'} data={getAttributeFromQuotes(quotes, 'dieLineSetupFeet')} />
        <TableRow header={'Total Stock Feet'} data={getAttributeFromQuotes(quotes, 'totalStockFeet')} />
        <TableRow header={'Throw Away Percentage'} data={getAttributeFromQuotes(quotes, 'throwAwayStockPercentage')} />
        <TableRow header={'Total Stock MSI'} data={getAttributeFromQuotes(quotes, 'totalStockMsi')} />
        <TableRow header={'Total Rolls of Paper'} data={getAttributeFromQuotes(quotes, 'totalRollsOfPaper')} />
        <TableRow header={'Extra Frames'} data={getAttributeFromQuotes(quotes, 'extraFrames')} />
        <TableRow header={'Total Frames'} data={getAttributeFromQuotes(quotes, 'totalFrames')} />
        <TableRow header={'Total Stock Cost'} data={getAttributeFromQuotes(quotes, 'totalStockCost')} /> */
      </div>
      <div className='output-group'>
        <TableRow header={'Total Finish Feet'} data={getAttributeFromQuotes(quotes, 'totalFinishFeet')} />
        <TableRow header={'Total Finish MSI'} data={getAttributeFromQuotes(quotes, 'totalFinishMsi')} />
        <TableRow header={'Total Finish Cost'} data={getAttributeFromQuotes(quotes, 'totalFinishCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalClicksCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Scaling Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'scalingClickCost')} />
        <TableRow header={'Proof Runup Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'proofRunupClickCost')} />
        <TableRow header={'Print Cleaner Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'printCleanerClickCost')} />
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalClicksCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'.5" Masking Tape (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'2" Packaging Tape (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Tape Cost (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cores'} data={getAttributeFromQuotes(quotes, 'totalCores')} />
        <TableRow header={'Total Core Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalCoreCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Box Cost'} data={getAttributeFromQuotes(quotes, 'totalBoxCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cost Material'} data={getAttributeFromQuotes(quotes, 'totalMaterialsCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Stock Splice'} data={getAttributeFromQuotes(quotes, 'stockSpliceTime')} />
        <TableRow header={'Color Calibration'} data={getAttributeFromQuotes(quotes, 'colorCalibrationTime')} />
        <TableRow header={'Printing Proof Time'} data={getAttributeFromQuotes(quotes, 'proofPrintingTime')} />
        <TableRow header={'Reinsertion Setup Time'} data={getAttributeFromQuotes(quotes, 'reinsertionSetupTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Roll Change Over Time'} data={getAttributeFromQuotes(quotes, 'rollChangeOverTime')} />
        <TableRow header={'Printing Stock Time'} data={getAttributeFromQuotes(quotes, 'printingStockTime')} />
        <TableRow header={'Reinsertion Printing Time'} data={getAttributeFromQuotes(quotes, 'reinsertionPrintingTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Print Tear Down'} data={getAttributeFromQuotes(quotes, 'printTearDownTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Time At Printing'} data={getAttributeFromQuotes(quotes, 'totalTimeAtPrinting')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Throw Away Print Time'} data={getAttributeFromQuotes(quotes, 'throwAwayPrintTimePercentage')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Printing Cost'} data={getAttributeFromQuotes(quotes, 'totalPrintingCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Stock-Splice'} data={getAttributeFromQuotes(quotes, 'cuttingStockSpliceTime')} />
        <TableRow header={'Die Setup'} data={getAttributeFromQuotes(quotes, 'dieSetupTime')} />
        <TableRow header={'Sheeted Setup'} data={getAttributeFromQuotes(quotes, 'sheetedSetupTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Stock Time'} data={getAttributeFromQuotes(quotes, 'cuttingStockTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Tear Down'} data={getAttributeFromQuotes(quotes, 'cuttingTearDownTime')} />
        <TableRow header={'Sheeted Tear Down'} data={getAttributeFromQuotes(quotes, 'sheetedTearDownTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Time At Cutting'} data={getAttributeFromQuotes(quotes, 'totalTimeAtCutting')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Cutting Diameter'} data={getAttributeFromQuotes(quotes, 'cuttingDiameter')} />
        <TableRow header={'Throw Away Cutting Time'} data={getAttributeFromQuotes(quotes, 'throwAwayCuttingTimePercentage')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cutting Cost'} data={getAttributeFromQuotes(quotes, 'totalTimeAtCutting')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Core Gathering Cost (TODO: Cost or Time?)'} data={getAttributeFromQuotes(quotes, 'coreGatheringTime')} />
        <TableRow header={'Change Over Time'} data={getAttributeFromQuotes(quotes, 'changeOverTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Winding All Rolls Time'} data={getAttributeFromQuotes(quotes, 'totalWindingRollTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Label Delivery To Shipping Time'} data={getAttributeFromQuotes(quotes, 'labelDropoffAtShippingTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Winding Time'} data={getAttributeFromQuotes(quotes, 'totalWindingTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Throw Away Winding Time'} data={getAttributeFromQuotes(quotes, 'throwAwayWindingTimePercentage')} />
        <TableRow header={'Total Finished Rolls'} data={getAttributeFromQuotes(quotes, 'totalFinishedRolls')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Winding Cost'} data={getAttributeFromQuotes(quotes, 'totalWindingCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Cost of Machine Time'} data={getAttributeFromQuotes(quotes, 'totalCostOfMachineTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Box Creation Time'} data={getAttributeFromQuotes(quotes, 'boxCreationTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Packaging Box Time'} data={getAttributeFromQuotes(quotes, 'packagingBoxTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Packaging Slips Time'} data={getAttributeFromQuotes(quotes, 'packingSlipsTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'totalShippingTime')} />
        <TableRow header={'Total Boxes (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Cost'} data={getAttributeFromQuotes(quotes, 'totalShippingCost')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'totalShippingTime')} />
      </div>
      <div className='output-group'>
        <TableRow header={'Total Material Cost'} data={getAttributeFromQuotes(quotes, 'totalMaterialsCost')} />
        <TableRow header={'Total Machine Cost (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Shipping Time Cost (DUP)'} data={getAttributeFromQuotes(quotes, 'totalShippingCost')} />
        <TableRow header={'Total Cost of Job (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Final Quoted Price (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Price Per Unit (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
    </div>
  );
});

export default QuoteOutputSection;