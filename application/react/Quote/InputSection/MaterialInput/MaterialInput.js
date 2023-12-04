import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField'
import './MaterialInput.scss';

export default MaterialInput = (props) => {
  const { onChange, isPrimaryMaterial } = props;
  const [materials, setMaterials ] = useState(['TODO', 'TODO', 'TODO']);

  useEffect(() => {
    // TODO (12-3-2023): Fetch all Materials from the database and set them in the state
  }, [])

  return (
    <div className='material-input-section'>
      <DropdownField header={isPrimaryMaterial ? 'Primary Material' : 'Secondary Material'} options={materials}/>
      <InputField accessor={'TODO'} header={'Initial Cost MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Freight MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Total Cost MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Quoted MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Thickness'} onChange={onChange}/>
    </div>
  )
}