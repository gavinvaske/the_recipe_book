import React from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';

const Materials = observer(() => {
  const materials = [{purchaseOrdersForMaterial: [{}]}];

  return (
    <div className='material-card-section full-width'>
      {materials.map(material => <Material material={material} />)}
    </div>
  )
});

export default Materials;