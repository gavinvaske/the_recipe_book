import React, { useState, useEffect } from 'react';
import './MaterialInput.scss';
import axios from 'axios';
import quoteStore from '../../../stores/quoteStore';
import { observer } from 'mobx-react-lite';

export default MaterialInput = observer((props) => {
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

  const computeTotalCostMsi = (isPrimaryMaterial, quoteStore) => {
    let material = isPrimaryMaterial ? 'primaryMaterialOverride' : 'secondaryMaterialOverride';

    const costPerMsi = quoteStore.quoteInputs[material].costPerMsi || 0;
    const freightMsi = quoteStore.quoteInputs[material].freightCostPerMsi || 0;
    const quotePricePerMsi = quoteStore.quoteInputs[material].quotePricePerMsi || 0;

    return (costPerMsi + freightMsi + quotePricePerMsi).toFixed(4);
  }

  useEffect(() => {
    axios.get(`/materials/all`)
      .then((response) => {
        const { data } = response;
        setMaterials(data);
      })
      .catch((error) => {
        alert('Error loading materials: ' + JSON.stringify(error));
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
        <TextField header={'Total Cost MSI'} value={computeTotalCostMsi(isPrimaryMaterial, quoteStore)} isReadOnly={true}/>
      </div>
      <div class='column'>
        <TextField accessor={'quotePricePerMsi'} header={'Quoted MSI'} onChange={(e) => updateMaterial(e, 'quotePricePerMsi')}/>
      </div>
      <div class='column'>
        <TextField accessor={'thickness'} header={'Thickness'} onChange={(e) => updateMaterial(e, 'thickness')}/>
      </div>
    </div>
  )
})