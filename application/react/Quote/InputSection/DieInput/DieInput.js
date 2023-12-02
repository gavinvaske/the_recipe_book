import React from 'react';
import InputField from '../InputField/InputField'
import './DieInput.scss';

export default Die = (props) => {
    const { onChange } = props;

  return (
    <div className='die-input-section'>
      <InputField accessor={'name'} header={'Die Name'} onChange={onChange}/>
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