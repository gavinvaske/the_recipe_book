import React, { useState, useEffect } from 'react';
import './MaterialInput.scss';

export default MaterialInput = (props) => {
  const { onChange, isPrimaryMaterial } = props;
  const [materials, setMaterials ] = useState(['TODO111', 'TODO2222', 'TODO3333']);

  useEffect(() => {
    // TODO (12-3-2023): Fetch all Materials from the database and set them in the state
  }, [])

  return (
    <div className='material-input-section'>
      <DropdownField header={isPrimaryMaterial ? 'Primary Material' : 'Secondary Material'} options={materials}/>
      <TextField accessor={'costPerMsi'} header={'Initial Cost MSI'} onChange={onChange}/>
      <TextField accessor={'freightCostPerMsi'} header={'Freight MSI'} onChange={onChange}/>
      <TextField header={'Total Cost MSI'} value={'TODO: Build this'} isReadOnly={true}/>
      <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={onChange}/>
      <TextField accessor={'thickness'} header={'Thickness'} onChange={onChange}/>
    </div>
  )
}