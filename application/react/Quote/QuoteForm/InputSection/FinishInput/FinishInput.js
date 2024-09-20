import React, { useEffect, useState } from 'react';
import './FinishInput.scss';
import TextField from '../InputFields/TextField/TextField';
import { DropdownField } from '../InputFields/DropdownField/DropdownField';
import quoteStore from '../../../../stores/quoteStore';
import { observer } from 'mobx-react-lite';

export default FinishInput = observer(() => {
  const { quoteInputs } = quoteStore;
  const [finishes, setFinishes] = useState([]);

  useEffect(() => {
    // TODO
  }, [])

  const computeTotalCostMsi = (quoteStore) => {
    const costPerMsi = quoteStore.quoteInputs.finishOverride.costPerMsi || 0;
    const freightMsi = quoteStore.quoteInputs.finishOverride.freightCostPerMsi || 0;
    const quotePricePerMsi = quoteStore.quoteInputs.finishOverride.quotePricePerMsi || 0;

    return (costPerMsi + freightMsi + quotePricePerMsi).toFixed(4);
  }

  return (
    <div className='finish-input-section card'>
      <DropdownField header={'Finish'} options={finishes.map((material) => material.name)} />
      <TextField accessor={'costPerMsi'} header={'Initial Cost MSI'} onChange={(e) => quoteInputs.finishOverride.costPerMsi = Number(e.target.value)} />
      <TextField accessor={'freightCostPerMsi'} header={'Freight MSI'} onChange={(e) => quoteInputs.finishOverride.freightCostPerMsi = Number(e.target.value)} />
      <TextField header={'Total Cost MSI'} value={computeTotalCostMsi(quoteStore)} isReadOnly={true} />
      <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={(e) => quoteInputs.finishOverride.quotePricePerMsi = Number(e.target.value)} />
      <TextField accessor={'thickness'} header={'Thickness'} onChange={(e) => quoteInputs.finishOverride.thickness = Number(e.target.value)} />
    </div>
  );
})