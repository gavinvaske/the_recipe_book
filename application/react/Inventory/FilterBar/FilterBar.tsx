import React, { useState } from 'react'
import './FilterBar.scss'
import SearchBar from '../../_global/SearchBar/SearchBar'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';
import { TextQuickFilter } from '../../_global/QuickFilterModal/TextQuickFilter/QuickFilterButton';
import { v4 as uuidv4 } from 'uuid';
import { MaterialInventory } from '../Inventory';
import { ConditionalQuickFilter } from '../../_global/QuickFilterModal/ConditionalQuickFilter/ConditionalQuickFilter';
import { ConditionalFilterFunction, TextFilterOption, TextFilter, ConditionalFilter } from '../../_types/Filters';

const allConditionalQuickFilters: ConditionalFilter<MaterialInventory>[] = [
  {
    uuid: uuidv4(),
    textToDisplay: 'This text is rendered',
    conditionalFilter: (objects: Partial<MaterialInventory>[]) => {
      return objects.filter((object) => {
        return object?.material?.name === 'Cloth'
      })
    }
  }
]

const allTextQuickFilters: TextFilter[] = [
  {
    description: 'materials',
    options: [
      {
        uuid: uuidv4(),
        value: 'semi-gloss'
      },
      {
        uuid: uuidv4(),
        value: 'matte'
      },
    ]
  },
  {
    description: 'Foo',
    options: [
      {
        uuid: uuidv4(),
        value: 'bar'
      },
    ]
  }
]

const renderTextQuickFilters = (textQuickFilters: TextFilter[]) => {
  return (
    textQuickFilters.map((quickFilter: TextFilter) => {
      const { description, options } = quickFilter;
      return (
        <div className='quick-filters-list'>
          Description: {description}
          {options.map((option: TextFilterOption) => (
            <TextQuickFilter
              uuid={option.uuid}
              filterValue={option.value}
              onDisabled={(uuid) => inventorySummaryStore.removeTextQuickFilter(uuid)}
              onEnabled={(uuid, filterValue) => inventorySummaryStore.setTextQuickFilter(uuid, filterValue)}
              key={option.uuid}
            />
          ))}
        </div>)
    })
  )
}

const renderConditionalQuickFilters = (conditionalFilterFunctions: ConditionalFilter<MaterialInventory>[]) => {
  return (
    conditionalFilterFunctions.map((filterFunction: ConditionalFilter<MaterialInventory>) => {
      const { uuid, textToDisplay, conditionalFilter } = filterFunction;
      return (
        <div className='quick-conditional-filters-list'>
          <ConditionalQuickFilter 
            uuid={uuid}
            conditionalFilterFunction={conditionalFilter}
            textToDisplay={textToDisplay}
            onDisabled={(uuid: string) => inventorySummaryStore.removeConditionalFilter(uuid)}
            onEnabled={(uuid: string, conditionalFilterFunction: ConditionalFilterFunction<MaterialInventory>) => inventorySummaryStore.setConditionalQuickFilter(uuid, conditionalFilterFunction)}
            key={uuid}
          />
        </div>)
    })
  )
}

const FilterBar = observer((props) => {
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false)
  const [isAdvancedDropdownDisplayed, setIsAdvancedDropdownDisplayed] = useState(false)

  function toggleQuickFilterMenu() {
    setIsDropdownDisplayed(!isDropdownDisplayed)
  }

  function toggleAdvancedQuickFilterMenu() {
    setIsAdvancedDropdownDisplayed(!isAdvancedDropdownDisplayed)
  }

  return (
    <div className="workflow-filter flex-center-left-row full-width card">
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/material-orders/create">PO <i className="fa-regular fa-plus"></i></a>
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/materials/form" role="button">Material <i className="fa-regular fa-plus"></i></a>
      
      <div className="search-wrapper flex-center-left-row">
        <i className="fa-regular fa-magnifying-glass flex-center-center-row"></i>
        <SearchBar
          value={inventorySummaryStore.getSearchBarInput()} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => inventorySummaryStore.setSearchBarInput(e.target.value)} 
        />
      </div>

      <div className="split-btn-frame btn-filter flex-center-center-row tooltip">
        <span className="tooltiptext">Filter by anything</span>
        <div className={`filter-btn-wrapper flex-center-center-row ${isDropdownDisplayed ? 'active' : ''}`}>
          <button className="btn-split quick-filter flex-center-center-row" onClick={() => toggleQuickFilterMenu()}>
            <i className="fa-light fa-filter"></i>Filter
          </button>
          <button className="btn-split-arrow-dropdown btn-advanced-filter" onClick={() => toggleAdvancedQuickFilterMenu()}>
            <i className="fa-regular fa-chevron-down"></i>
          </button>
        </div>
        <div className={`quick-filter-dropdown dropdown ${isDropdownDisplayed ? 'active' : ''}`}>
          <h5><b>Quick Filter</b></h5>
          {renderTextQuickFilters(allTextQuickFilters)}
        </div>

        <div className={`advanced-filter-dropdown dropdown ${isAdvancedDropdownDisplayed ? 'active' : ''}`}>
          <h5><b>Advanced Filter</b></h5>
          {renderConditionalQuickFilters(allConditionalQuickFilters)}
        </div>

      </div>
      <div className="all-wrapper tooltip">
        <span className="tooltiptext">See All</span>
        <button className="sort btn-sort see-all" onClick={() => inventorySummaryStore.resetAllFilters()}><i className="fa-solid fa-layer-group"></i> See All(<span id="material-count">{inventorySummaryStore.getAllMaterialInventories().length}</span>)</button>
      </div>
    </div>
  )
})

export default FilterBar