import React from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import { MaterialInventory } from '../Inventory';

const Materials = observer((props: {inventorySummaryStore: any}) => {
  const { inventorySummaryStore } = props;
  const materialInventories : MaterialInventory[] = inventorySummaryStore.getMaterialInventories() || [];

  return (
    <div className='material-card-section full-width'>
      {materialInventories && materialInventories.map(materialInventory => <Material materialInventory={materialInventory} key={materialInventory.material._id} />)}
    </div>
  )
});

export default Materials;