import React, { useState, useEffect } from 'react';
import './MaterialInput.scss';
import axios from 'axios';
import quoteStore from '../../../stores/quoteStore';

export default MaterialInput = (props) => {
  const { isPrimaryMaterial } = props;
  const [materials, setMaterials] = useState([]);
  const { quoteInputs } = quoteStore;

  const updateMaterial = (e, attributeName) => {
    if (isPrimaryMaterial) {
      quoteInputs.primaryMaterialOverride[attributeName] = Number(e.target.value);
    } else {
      quoteInputs.secondaryMaterialOverride[attributeName] = Number(e.target.value);
    }
  }

  useEffect(() => {
    axios.get(`/materials/all`)
      .then((response) => {
        const { data } = response;
        setMaterials(data);
      })
      .catch((error) => {
        alert('Error:', error);
      });
  }, [])

  return (
    <div className='material-input-section card'>
        <DropdownField header={isPrimaryMaterial ? 'Primary Material' : 'Secondary Material'} options={materials.map((material) => material.name)}/>
      <div class='column'>
        <TextField accessor={'costPerMsi'} header={'Initial Cost MSI'} onChange={(e) => updateMaterial(e, 'costPerMsi')}/>
      </div>
      <div class='column'>
        <TextField accessor={'freightCostPerMsi'} header={'Freight MSI'} onChange={(e) => updateMaterial(e, 'freightCostPerMsi')}/>
      </div>
      <div class='column'>
        <TextField header={'Total Cost MSI'} value={'TODO: Build this (use mobX computed value)'} isReadOnly={true}/>
      </div>
      <div class='column'>
        <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={(e) => updateMaterial(e, 'quotePricePerMsi')}/>
      </div>
      <div class='column'>
        <TextField accessor={'thickness'} header={'Thickness'} onChange={(e) => updateMaterial(e, 'thickness')}/>
      </div>
    </div>
  )
}