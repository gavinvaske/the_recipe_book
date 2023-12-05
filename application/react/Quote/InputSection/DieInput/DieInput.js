import React, { useState, useEffect } from 'react';
import './DieInput.scss';
import DropdownField from '../InputFields/DropdownField/DropdownField';
import TextField from '../InputFields/TextField/TextField';

export default Die = (props) => {
  const { onChange } = props;
  const [ dies, setDies ] = useState(['TODO11', 'TODO22', 'TODO33']);

  useEffect(() => {
    // TODO (12-3-2023): Fetch all Dies from the database and set them in the state
  }, [])

  return (
    <div className='die-input-section'>
      <DropdownField options={dies} header='Die Name'/>
      <TextField accessor={'sizeAcross'} header={'Size Across'} onChange={onChange}/>
      <TextField accessor={'sizeAround'} header={'Size Around'} onChange={onChange}/>
      <TextField accessor={'cornerRadius'} header={'Corner Radius'} onChange={onChange}/>
      <TextField accessor={'shape'} header={'Shape'} onChange={onChange}/>
      <TextField accessor={'colSpace'} header={'Col Space'} onChange={onChange}/>
      <TextField accessor={'rowSpace'} header={'Row Space'} onChange={onChange}/>
      <TextField accessor={'numberAround'} header={'Number Around'} onChange={onChange}/>
    </div>
  )
};