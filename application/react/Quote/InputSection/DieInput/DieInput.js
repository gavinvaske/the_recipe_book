import React from 'react';
import InputField from '../InputField/InputField'
import './DieInput.scss';

export default Die = () => {
  return (
    <div className='die-input-section'>
      <InputField header={'Die Name'}/>
      <InputField header={'Size Across'}/>
      <InputField header={'Size Around'}/>
      <InputField header={'Corner Radius'}/>
      <InputField header={'Shape'}/>
      <InputField header={'Col Space'}/>
      <InputField header={'Row Space'}/>
      <InputField header={'Number Around'}/>
    </div>
  )
};