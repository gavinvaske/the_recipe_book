import React, { useState, useEffect } from 'react';
import './MaterialInput.scss';
import axios from 'axios';
import quoteStore from '../../../stores/quoteStore';

export default MaterialInput = (props) => {
  const { isPrimaryMaterial } = props;
  const [materials, setMaterials ] = useState(['TODO111', 'TODO2222', 'TODO3333']);

  const updateMaterial = (e, attributeName) => {
    if (isPrimaryMaterial) {
      quoteStore.quoteInputs.primaryMaterialOverride[attributeName] = e.target.value;
    } else {
      quoteStore.quoteInputs.secondaryMaterialOverride[attributeName] = e.target.value;
    }
  }

  useEffect(() => {
    axios.get(`/materials/all`)
      .then((response) => {
        const { data } = response;
        setMaterials(data);
      })
      .catch((error) => {
        alert('error:', error);
      });
  }, [])

  return (
    <div className='material-input-section'>
      <DropdownField header={isPrimaryMaterial ? 'Primary Material' : 'Secondary Material'} options={materials.map((material) => material.name)}/>
      <TextField accessor={'costPerMsi'} header={'Initial Cost MSI'} onChange={(e) => updateMaterial(e, 'costPerMsi')}/>
      <TextField accessor={'freightCostPerMsi'} header={'Freight MSI'} onChange={(e) => updateMaterial(e, 'freightCostPerMsi')}/>
      <TextField header={'Total Cost MSI'} value={'TODO: Build this (use mobX computed value)'} isReadOnly={true}/>
      <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={(e) => updateMaterial(e, 'quotePricePerMsi')}/>
      <TextField accessor={'thickness'} header={'Thickness'} onChange={(e) => updateMaterial(e, 'thickness')}/>
    </div>
  )
}