import React, { useState } from 'react';
import './FilterBar.scss';
import { observer } from 'mobx-react-lite';
import { ConditionalFilter, ConditionalFilterFunction, Filter, TextFilter, TextFilterOption } from '../../_types/Filters';
import { ConditionalQuickFilter } from '../QuickFilterModal/ConditionalQuickFilter/ConditionalQuickFilter';
import { TextQuickFilter } from '../QuickFilterModal/TextQuickFilter/QuickFilterButton';
import SearchBar from '../SearchBar/SearchBar';

const renderTextQuickFilters = <T extends any>(textQuickFilters: TextFilter[], store: Filter<T>) => {
  return (
    textQuickFilters.map((quickFilter: TextFilter) => {
      const { description, options } = quickFilter;
      return (
        <div className='quick-filters-list'>
          <span className='filter-description'>Description: {description}</span>
          {options.map((option: TextFilterOption) => (
            <TextQuickFilter
              uuid={option.uuid}
              filterValue={option.value}
              onDisabled={(uuid) => store.removeTextQuickFilter(uuid)}
              onEnabled={(uuid, filterValue) => store.setTextQuickFilter(uuid, filterValue)}
              key={option.uuid}
              filtersStore={store}
            />
          ))}
        </div>)
    })
  )
}

const renderConditionalQuickFilters = <T extends any>(conditionalFilterFunctions: ConditionalFilter<T>[], store: Filter<T>) => {
  return (
    conditionalFilterFunctions.map((filterFunction: ConditionalFilter<T>) => {
      const { uuid, textToDisplay, conditionalFilter } = filterFunction;
      return (
        <div className='quick-conditional-filters-list'>
          <ConditionalQuickFilter
            uuid={uuid}
            conditionalFilterFunction={conditionalFilter}
            textToDisplay={textToDisplay}
            onDisabled={(uuid: string) => store.removeConditionalFilter(uuid)}
            onEnabled={(uuid: string, conditionalFilterFunction: ConditionalFilterFunction<T>) => store.setConditionalQuickFilter(uuid, conditionalFilterFunction)}
            key={uuid}
            filtersStore={store}
          />
        </div>)
    })
  )
}

type Props<T> = {
  conditionalQuickFilters: ConditionalFilter<T>[];
  textQuickFilters: TextFilter[];
  store: Filter<T>
  filterableItemsCount: number
}

export const FilterBar = observer(<T extends any>(props: Props<T>) => {
  const { conditionalQuickFilters, textQuickFilters, store, filterableItemsCount } = props
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false)
  const [isAdvancedDropdownDisplayed, setIsAdvancedDropdownDisplayed] = useState(false)

  function toggleQuickFilterMenu() {
    setIsAdvancedDropdownDisplayed(false);
    setIsDropdownDisplayed(!isDropdownDisplayed)
  }

  function toggleAdvancedQuickFilterMenu() {
    setIsDropdownDisplayed(false);
    setIsAdvancedDropdownDisplayed(!isAdvancedDropdownDisplayed)
  }
 
  return (
    <>
      <div className="search-wrapper flex-center-left-row">
        <i className="fa-regular fa-magnifying-glass flex-center-center-row"></i>
        <SearchBar
          value={store.getSearchBarInput()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.setSearchBarInput(e.target.value)}
        />
      </div>

      <div className="split-btn-frame btn-filter flex-center-center-row tooltip">
        <span className="tooltiptext">Filter by anything</span>
        <div className={`filter-btn-wrapper flex-center-center-row ${isDropdownDisplayed ? 'active' : '' || isAdvancedDropdownDisplayed ? 'active' : ''}`}>
          <button className="btn-split quick-filter flex-center-center-row" onClick={() => toggleQuickFilterMenu()}>
            <i className="fa-light fa-filter"></i>Filter
          </button>
          <button className="btn-split-arrow-dropdown btn-advanced-filter" onClick={() => toggleAdvancedQuickFilterMenu()}>
            <i className="fa-regular fa-chevron-down"></i>
          </button>
        </div>
        <div className={`quick-filter-dropdown quick-filter-drpdwn dropdown ${isDropdownDisplayed ? 'active' : ''}`}>
          <h5><b>Quick filters</b></h5>
          {renderTextQuickFilters(textQuickFilters, store)}
        </div>

        <div className={`advanced-filter-dropdown dropdown ${isAdvancedDropdownDisplayed ? 'active' : ''}`}>
          <h5><b>Advanced Filter</b></h5>
          {renderConditionalQuickFilters(conditionalQuickFilters, store)}
        </div>

      </div>
      <div className="all-wrapper tooltip">
        <span className="tooltiptext">See All</span>
        <button className="sort btn-sort see-all" onClick={() => store.resetAllFilters()}><i className="fa-solid fa-layer-group"></i> See All(<span id="material-count">{filterableItemsCount}</span>)</button>
      </div>
    </>
  );
})