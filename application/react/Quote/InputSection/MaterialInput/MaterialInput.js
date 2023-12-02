import React from 'react';
import InputField from '../InputField/InputField'
import './MaterialInput.scss';

export default MaterialInput = (props) => {
  const { onChange, isPrimaryMaterial } = props;

  return (
    <div className='material-input-section'>
      <InputField accessor={'TODO'} header={isPrimaryMaterial ? 'Primary Material' : 'Secondary Material'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Initial Cost MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Freight MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Total Cost MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Quoted MSI'} onChange={onChange}/>
      <InputField accessor={'TODO'} header={'Thickness'} onChange={onChange}/>
    </div>
  )
}