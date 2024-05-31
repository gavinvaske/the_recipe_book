import React from 'react'
import './InventoryFilterBar.scss'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';
import { conditionalQuickFilters, textQuickFilters } from './quickFilters';
import { FilterBar } from '../../_global/FilterBar/FilterBar';

const InventoryFilterBar = observer((_) => {

  return (
    <div id='inventory-filter-bar'>
      <FilterBar
        conditionalQuickFilters={conditionalQuickFilters}
        textQuickFilters={textQuickFilters}
        store={inventorySummaryStore}
        filterableItemsCount={inventorySummaryStore.getAllMaterialInventories().length}
      />
    </div>
  )
})

export default InventoryFilterBar