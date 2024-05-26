import React from 'react';
import './Summary.scss'
import { observer } from 'mobx-react-lite';
import { MaterialInventorySummary } from '../Inventory';

const Summary = observer((props: {inventorySummaryStore: any}) => {
  const { inventorySummaryStore } = props;
  const inventorySummary: Partial<MaterialInventorySummary> = inventorySummaryStore.getInventorySummary();

  return (
    <div className='material-header flex-top-space-between-row full-width'>
      <div className='card col col-one'>
        <h1>Inventory Page</h1>
      </div>
      <div className='card col col-two'>
        <span>Feet On Hand</span>
        <h1 className='total-length-of-material-in-inventory'>{inventorySummary.lengthOfAllMaterialsInInventory}</h1>
      </div>
      <div className='card col col-three'>
        <span>Net Feet</span>
        <h1 className='net-length-of-material-in-inventory'>{inventorySummary.netLengthOfMaterialInInventory}</h1>
      </div>
      <div className='card col col-four'>
        <span>Feet On Order</span>
        <h1 className='total-length-of-material-ordered'>{inventorySummary.lengthOfAllMaterialsOrdered}</h1>
      </div>
    </div>
  )
});

export default Summary;