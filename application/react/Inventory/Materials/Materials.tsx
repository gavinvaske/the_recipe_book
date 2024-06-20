import React from 'react';
import './Materials.scss'
import { observer } from 'mobx-react-lite';
import Material from './Material/Material';
import { MaterialInventory } from '../Inventory';


type Props = {
  inventorySummaryStore: any,
  onMaterialClicked: (materialInventory: MaterialInventory) => void
}

const Materials = observer((props: Props) => {
  const { inventorySummaryStore, onMaterialClicked } = props;
  const materialInventories : MaterialInventory[] = inventorySummaryStore.getFilteredMaterialInventories() || [];

  return (
    <div className='material-card-section full-width'>
      {materialInventories.map((materialInventory, index: number) =>
        <Material 
          materialInventory={materialInventory} 
          key={materialInventory.material._id}
          onClick={() => onMaterialClicked(materialInventory)}
        />
      )}
    </div>
  )
});

export default Materials;