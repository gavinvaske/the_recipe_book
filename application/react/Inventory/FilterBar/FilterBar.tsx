import React, { useState } from 'react'
import './FilterBar.scss'
import SearchBar from '../../_global/SearchBar/SearchBar'
import inventorySummaryStore from '../../stores/inventorySummaryStore';
import { observer } from 'mobx-react-lite';
import { TextQuickFilter } from '../../_global/QuickFilterModal/TextQuickFilter/QuickFilterButton';
import { v4 as uuidv4 } from 'uuid';

type QuickFilterOption = {
  uuid: string,
  value: string
}
export type QuickFilter = {
  description: string,
  options: QuickFilterOption[],
}

const allPossibleQuickFilters: QuickFilter[] = [
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

const renderQuickFilters = (allPossibleQuickFilters: QuickFilter[]) => {
  return (
    allPossibleQuickFilters.map((quickFilter: QuickFilter) => {
      const { description, options } = quickFilter;
      return (
        <div className='quick-filters-list'>
          Description: {description}
          {options.map((option: QuickFilterOption) => (
            <TextQuickFilter
              uuid={option.uuid}
              filterValue={option.value}
              onDisabled={(uuid) => inventorySummaryStore.removeQuickFilter(uuid)}
              onEnabled={(uuid, filterValue) => inventorySummaryStore.setQuickFilter(uuid, filterValue)}
            />
          ))}
        </div>)
    })
  )
}

const FilterBar = observer((props) => {
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false)

  function toggleQuickFilterMenu() {
    setIsDropdownDisplayed(!isDropdownDisplayed)
  }

  return (
    <div className="workflow-filter flex-center-left-row full-width card">
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/material-orders/create">PO <i className="fa-regular fa-plus"></i></a>
      <a className="create bg-blue text-white border-blue btn-create new-po-btn" href="/materials/form" role="button">Material <i className="fa-regular fa-plus"></i></a>
      
      <div className="search-wrapper flex-center-left-row">
        <i className="fa-regular fa-magnifying-glass flex-center-center-row"></i>
        <SearchBar 
          value={inventorySummaryStore.getTextFilter()} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => inventorySummaryStore.setTextFilter(e.target.value)} 
        />
      </div>

      <div className="split-btn-frame btn-filter flex-center-center-row tooltip">
        <span className="tooltiptext">Filter by anything</span>
        <div className={`filter-btn-wrapper flex-center-center-row ${isDropdownDisplayed ? 'active' : ''}`}>
          <button className="btn-split quick-filter flex-center-center-row" onClick={() => toggleQuickFilterMenu()}>
            <i className="fa-light fa-filter"></i>Filter
          </button>
          <button className="btn-split-arrow-dropdown btn-advanced-filter" onClick={() => toggleQuickFilterMenu()}>
            <i className="fa-regular fa-chevron-down"></i>
          </button>
        </div>
        <div className={`quick-filter-dropdown dropdown ${isDropdownDisplayed ? 'active' : ''}`}>
          <h5><b>Quick Filter</b></h5>
          {renderQuickFilters(allPossibleQuickFilters)}
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