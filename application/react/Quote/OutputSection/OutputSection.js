import React from 'react';
import './OutputSection.scss';
import TableRow from '../TableRow/TableRow';
import quoteStore from '../../stores/quoteStore'
import { observer } from 'mobx-react-lite';
import { 
    secondsFormatter,
    floatingPointFormatter, 
    percentageFormatter, 
    currencyFormatter 
} from '../../utils/formatters';

const TWO_DECIMALS = 2;
const ZERO_DECIMALS = 0;

const getAttributeFromQuotes = (quotes, attribute) => {
  return quotes.map(quote => quote[attribute]);
}

const getTotalBoxesFromQuotes = (quotes) => {
    return quotes.map(quote => {
        return quote.packagingDetails ? quote.packagingDetails.totalBoxes : null;
    })
};

const QuoteOutputSection = observer(() => {
  const { quotes } = quoteStore;

  return (
    <div id='quote-output-section'>
      <div className='output-group card'>
        <TableRow header={'Initial Stock Length'} data={getAttributeFromQuotes(quotes, 'initialStockLength')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Proof Run Feet'} data={getAttributeFromQuotes(quotes, 'proofRunupFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Color Calibration Feet'} data={getAttributeFromQuotes(quotes, 'colorCalibrationFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Die Cutter Setup Feet'} data={getAttributeFromQuotes(quotes, 'dieCutterSetupFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Print Cleaner Feet'} data={getAttributeFromQuotes(quotes, 'printCleanerFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Scaling Feet'} data={getAttributeFromQuotes(quotes, 'scalingFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'New Material Setup Feet'} data={getAttributeFromQuotes(quotes, 'newMaterialSetupFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Die Line Setup Feet'} data={getAttributeFromQuotes(quotes, 'dieLineSetupFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Stock Feet'} data={getAttributeFromQuotes(quotes, 'totalStockFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Throw Away Percentage'} data={getAttributeFromQuotes(quotes, 'throwAwayStockPercentage')} formatter={percentageFormatter(TWO_DECIMALS)} />
        <TableRow header={'Total Stock MSI'} data={getAttributeFromQuotes(quotes, 'totalStockMsi')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Rolls of Paper'} data={getAttributeFromQuotes(quotes, 'totalRollsOfPaper')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Extra Frames'} data={getAttributeFromQuotes(quotes, 'extraFrames')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Frames'} data={getAttributeFromQuotes(quotes, 'totalFrames')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Stock Cost'} data={getAttributeFromQuotes(quotes, 'totalStockCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Finish Feet'} data={getAttributeFromQuotes(quotes, 'totalFinishFeet')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Finish MSI'} data={getAttributeFromQuotes(quotes, 'totalFinishMsi')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Finish Cost'} data={getAttributeFromQuotes(quotes, 'totalFinishCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalClicksCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Scaling Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'scalingClickCost')} formatter={currencyFormatter} />
        <TableRow header={'Proof Runup Click Cost Dollars'} data={getAttributeFromQuotes(quotes, 'proofRunupClickCost')} formatter={currencyFormatter} />
        <TableRow header={'Print Cleaner Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'printCleanerClickCost')} formatter={currencyFormatter} />
        <TableRow header={'Total Clicks Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalClicksCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'.5" Masking Tape (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'2" Packaging Tape (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
        <TableRow header={'Total Tape Cost (TODO)'} data={getAttributeFromQuotes(quotes, 'TODO')} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Cores'} data={getAttributeFromQuotes(quotes, 'totalCores')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
        <TableRow header={'Total Core Cost Dollars'} data={getAttributeFromQuotes(quotes, 'totalCoreCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Box Cost'} data={getAttributeFromQuotes(quotes, 'totalBoxCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Cost Material'} data={getAttributeFromQuotes(quotes, 'totalMaterialsCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Stock Splice'} data={getAttributeFromQuotes(quotes, 'stockSpliceTime')} formatter={secondsFormatter} />
        <TableRow header={'Color Calibration'} data={getAttributeFromQuotes(quotes, 'colorCalibrationTime')} formatter={secondsFormatter} />
        <TableRow header={'Printing Proof Time'} data={getAttributeFromQuotes(quotes, 'proofPrintingTime')} formatter={secondsFormatter} />
        <TableRow header={'Reinsertion Setup Time'} data={getAttributeFromQuotes(quotes, 'reinsertionSetupTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Roll Change Over Time'} data={getAttributeFromQuotes(quotes, 'rollChangeOverTime')} formatter={secondsFormatter} />
        <TableRow header={'Printing Stock Time'} data={getAttributeFromQuotes(quotes, 'printingStockTime')} formatter={secondsFormatter} />
        <TableRow header={'Reinsertion Printing Time'} data={getAttributeFromQuotes(quotes, 'reinsertionPrintingTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Print Tear Down'} data={getAttributeFromQuotes(quotes, 'printTearDownTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Time At Printing'} data={getAttributeFromQuotes(quotes, 'totalTimeAtPrinting')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Throw Away Print Time'} data={getAttributeFromQuotes(quotes, 'throwAwayPrintTimePercentage')} formatter={percentageFormatter(TWO_DECIMALS)} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Printing Cost'} data={getAttributeFromQuotes(quotes, 'totalPrintingCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Cutting Stock-Splice'} data={getAttributeFromQuotes(quotes, 'cuttingStockSpliceTime')} formatter={secondsFormatter} />
        <TableRow header={'Die Setup'} data={getAttributeFromQuotes(quotes, 'dieSetupTime')} formatter={secondsFormatter} />
        <TableRow header={'Sheeted Setup'} data={getAttributeFromQuotes(quotes, 'sheetedSetupTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Cutting Stock Time'} data={getAttributeFromQuotes(quotes, 'cuttingStockTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Cutting Tear Down'} data={getAttributeFromQuotes(quotes, 'cuttingTearDownTime')} formatter={secondsFormatter} />
        <TableRow header={'Sheeted Tear Down'} data={getAttributeFromQuotes(quotes, 'sheetedTearDownTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Time At Cutting'} data={getAttributeFromQuotes(quotes, 'totalTimeAtCutting')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Cutting Diameter'} data={getAttributeFromQuotes(quotes, 'cuttingDiameter')} formatter={floatingPointFormatter(TWO_DECIMALS)} />
        <TableRow header={'Throw Away Cutting Time'} data={getAttributeFromQuotes(quotes, 'throwAwayCuttingTimePercentage')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Cutting Cost'} data={getAttributeFromQuotes(quotes, 'totalTimeAtCutting')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Core Gathering Cost (TODO: Cost or Time?)'} data={getAttributeFromQuotes(quotes, 'coreGatheringTime')} />
        <TableRow header={'Change Over Time'} data={getAttributeFromQuotes(quotes, 'changeOverTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Winding All Rolls Time'} data={getAttributeFromQuotes(quotes, 'totalWindingRollTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Label Delivery To Shipping Time'} data={getAttributeFromQuotes(quotes, 'labelDropoffAtShippingTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Winding Time'} data={getAttributeFromQuotes(quotes, 'totalWindingTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Throw Away Winding Time'} data={getAttributeFromQuotes(quotes, 'throwAwayWindingTimePercentage')} formatter={percentageFormatter(TWO_DECIMALS)} />
        <TableRow header={'Total Finished Rolls'} data={getAttributeFromQuotes(quotes, 'totalFinishedRolls')} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Winding Cost'} data={getAttributeFromQuotes(quotes, 'totalWindingCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Cost of Machine Time'} data={getAttributeFromQuotes(quotes, 'totalCostOfMachineTime')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Box Creation Time'} data={getAttributeFromQuotes(quotes, 'boxCreationTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Packaging Box Time'} data={getAttributeFromQuotes(quotes, 'packagingBoxTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Packaging Slips  '} data={getAttributeFromQuotes(quotes, 'packingSlipsTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'totalShippingTime')} formatter={secondsFormatter} />
        <TableRow header={'Total Boxes'} data={getTotalBoxesFromQuotes(quotes)} formatter={floatingPointFormatter(ZERO_DECIMALS)} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Shipping Cost'} data={getAttributeFromQuotes(quotes, 'totalShippingCost')} formatter={currencyFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Shipping Time'} data={getAttributeFromQuotes(quotes, 'totalShippingTime')} formatter={secondsFormatter} />
      </div>
      <div className='output-group card'>
        <TableRow header={'Total Material Cost'} data={getAttributeFromQuotes(quotes, 'totalMaterialsCost')} formatter={currencyFormatter} />
        <TableRow header={'Total Machine Cost'} data={getAttributeFromQuotes(quotes, 'totalMachineCost')} formatter={currencyFormatter} />
        <TableRow header={'Total Shipping Time Cost (DUP)'} data={getAttributeFromQuotes(quotes, 'totalShippingCost')} formatter={currencyFormatter} />
        <TableRow header={'Total Production Cost'} data={getAttributeFromQuotes(quotes, 'totalProductionCost')} formatter={currencyFormatter} />
        <TableRow header={'Quoted Price'} data={getAttributeFromQuotes(quotes, 'quotedPrice')} formatter={currencyFormatter} />
        <TableRow header={'Price Per Label'} data={getAttributeFromQuotes(quotes, 'pricePerLabel')} formatter={currencyFormatter} />
      </div>
    </div>
  );
});

export default QuoteOutputSection;