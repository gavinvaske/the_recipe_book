import React, { useState, useEffect } from 'react';
import './DieInput.scss';
import DropdownField from '../InputFields/DropdownField/DropdownField';
import TextField from '../InputFields/TextField/TextField';
import quoteStore from '../../../stores/quoteStore';
import axios from 'axios';

export default Die = (props) => {
  const dieOverride = quoteStore.quoteInputs.dieOverride;
  const [ dies, setDies ] = useState([]);

  useEffect(() => {
    axios.get(`/die`)
      .then((response) => {
        const { data } = response;
        setDies(data)
      })
      .catch((error) => {
        alert('Error:', error);
      });
  }, [])

  return (
    <div className='die-input-section'>
      <DropdownField options={dies.map((die) => die.dieNumber)} header='Die Name'/>
      <TextField accessor={'sizeAcross'} header={'Size Across'} onChange={(e) => dieOverride.sizeAcross = e.target.value}/>
      <TextField accessor={'sizeAround'} header={'Size Around'} onChange={(e) => dieOverride.sizeAround = e.target.value}/>
      <TextField accessor={'cornerRadius'} header={'Corner Radius'} onChange={(e) => dieOverride.cornerRadius = e.target.value}/>
      <TextField accessor={'shape'} header={'Shape'} onChange={(e) => dieOverride.shape = e.target.value}/>
      <TextField accessor={'colSpace'} header={'Col Space'} onChange={(e) => dieOverride.colSpace = e.target.value}/>
      <TextField accessor={'rowSpace'} header={'Row Space'} onChange={(e) => dieOverride.rowSpace = e.target.value}/>
      <TextField accessor={'numberAround'} header={'Number Around'} onChange={(e) => dieOverride.numberAround = e.target.value}/>
    </div>
  )
};