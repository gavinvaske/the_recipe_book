import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField'
import './DieInput.scss';
import DropdownField from '../DropdownField/DropdownField';

export default Die = (props) => {
  const { onChange } = props;
  const [ dies, setDies ] = useState(['TODO', 'TODO', 'TODO']);

  useEffect(() => {
    // TODO (12-3-2023): Fetch all Dies from the database and set them in the state
  }, [])

  return (
    <div className='die-input-section'>
      <DropdownField options={dies} header='Die Name'/>
      <InputField accessor={'sizeAcross'} header={'Size Across'} onChange={onChange}/>
      <InputField accessor={'sizeAround'} header={'Size Around'} onChange={onChange}/>
      <InputField accessor={'cornerRadius'} header={'Corner Radius'} onChange={onChange}/>
      <InputField accessor={'shape'} header={'Shape'} onChange={onChange}/>
      <InputField accessor={'colSpace'} header={'Col Space'} onChange={onChange}/>
      <InputField accessor={'rowSpace'} header={'Row Space'} onChange={onChange}/>
      <InputField accessor={'numberAround'} header={'Number Around'} onChange={onChange}/>
    </div>
  )
};