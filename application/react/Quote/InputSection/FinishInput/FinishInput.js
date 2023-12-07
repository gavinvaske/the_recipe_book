import React, { useEffect, useState } from 'react';
import './FinishInput.scss';
import TextField from '../InputFields/TextField/TextField';
import DropdownField from '../InputFields/DropdownField/DropdownField';
import quoteStore from '../../../stores/quoteStore';

export default FinishInput = () => {
  const { quoteInputs } = quoteStore;
  const [finishes, setFinishes] = useState([]);

  useEffect(() => {
    // TODO
  }, [])

  return (
    <div className='finish-input-section'>
      <DropdownField header={'Finish'} options={finishes.map((material) => material.name)} />
      <TextField accessor={'costPerMsi'} header={'Initial Cost MSI'} onChange={(e) => quoteInputs.finishOverride.costPerMsi = e.target.value} />
      <TextField accessor={'freightCostPerMsi'} header={'Freight MSI'} onChange={(e) => quoteInputs.finishOverride.freightCostPerMsi = e.target.value} />
      <TextField header={'Total Cost MSI'} value={'TODO: Build this (use mobX computed value)'} isReadOnly={true} />
      <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={(e) => quoteInputs.finishOverride.quotePricePerMsi = e.target.value} />
      <TextField accessor={'thickness'} header={'Thickness'} onChange={(e) => quoteInputs.finishOverride.thickness = e.target.value} />
    </div>
  );
}