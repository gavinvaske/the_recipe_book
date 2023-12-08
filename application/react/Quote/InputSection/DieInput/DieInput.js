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
      <TextField accessor={'sizeAcross'} header={'Size Across'} onChange={(e) => dieOverride.sizeAcross = Number(e.target.value)}/>
      <TextField accessor={'sizeAround'} header={'Size Around'} onChange={(e) => dieOverride.sizeAround = Number(e.target.value)}/>
      <TextField accessor={'cornerRadius'} header={'Corner Radius'} onChange={(e) => dieOverride.cornerRadius = Number(e.target.value)}/>
      <TextField accessor={'shape'} header={'Shape'} onChange={(e) => dieOverride.shape = e.target.value}/>
      <TextField accessor={'colSpace'} header={'Col Space'} onChange={(e) => dieOverride.spaceAcross = Number(e.target.value)}/>
      <TextField accessor={'rowSpace'} header={'Row Space'} onChange={(e) => dieOverride.spaceAround = Number(e.target.value)}/>
      <TextField accessor={'numberAround'} header={'Number Around'} onChange={(e) => dieOverride.numberAround = Number(e.target.value)}/>
      <TextField accessor={'numberAcross'} header={'Number Across'} onChange={(e) => dieOverride.numberAcross = Number(e.target.value)}/>
    </div>
  )
};