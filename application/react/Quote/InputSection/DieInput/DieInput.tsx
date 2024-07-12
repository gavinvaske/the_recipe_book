import React, { useState, useEffect } from 'react';
import './DieInput.scss';
import DropdownField from '../InputFields/DropdownField/DropdownField';
import TextField from '../InputFields/TextField/TextField';
import quoteStore from '../../../stores/quoteStore';
import axios, { AxiosError } from 'axios';
import { Die } from '../../../_types/databaseModels/die';
import { useErrorMessage } from '../../../_hooks/useErrorMessage';

const Die = (props) => {
  const dieOverride = quoteStore.quoteInputs.dieOverride as Die;
  const [ dies, setDies ] = useState<Die[]>([]);

  useEffect(() => {
    axios.get(`/die`)
      .then((response) => {
        const { data } = response;
        setDies(data)
      })
      .catch((error: AxiosError) => useErrorMessage(error))
  }, [])

  return (
    <div className='die-input-section card'>
        <DropdownField options={dies.map((die) => die.dieNumber)} header='Die Name'/>
      <div className='column'>
        <TextField accessor={'sizeAcross'} header={'Size Across'} onChange={(e) => dieOverride.sizeAcross = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'sizeAround'} header={'Size Around'} onChange={(e) => dieOverride.sizeAround = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'cornerRadius'} header={'Corner Radius'} onChange={(e) => dieOverride.cornerRadius = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'shape'} header={'Shape'} onChange={(e) => dieOverride.shape = e.target.value}/>
      </div>
      <div className='column'>
        <TextField accessor={'colSpace'} header={'Col Space'} onChange={(e) => dieOverride.spaceAcross = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'rowSpace'} header={'Row Space'} onChange={(e) => dieOverride.spaceAround = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'numberAround'} header={'Number Around'} onChange={(e) => dieOverride.numberAround = Number(e.target.value)}/>
      </div>
      <div className='column'>
        <TextField accessor={'numberAcross'} header={'Number Across'} onChange={(e) => dieOverride.numberAcross = Number(e.target.value)}/>
      </div>
    </div>
  )
};

export default Die