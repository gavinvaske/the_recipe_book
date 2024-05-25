import React from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import { MaterialInventorySummary, MaterialInventory } from '../Inventory';

const Materials = observer((props: {inventorySummary: Partial<MaterialInventorySummary>}) => {
  const { inventorySummary } = props;
  const materialInventories : MaterialInventory[] = inventorySummary.materialInventories || [];

  return (
    <div className='material-card-section full-width'>
      {materialInventories && materialInventories.map(materialInventory => <Material materialInventory={materialInventory} key={materialInventory.material._id} />)}
    </div>
  )
});

export default Materials;