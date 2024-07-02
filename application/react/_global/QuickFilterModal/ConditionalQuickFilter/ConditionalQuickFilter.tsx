import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './ConditionalQuickFilter.scss'
import { ConditionalFilterFunction } from '../../../_types/Filters';

type Props<T> = {
  uuid: string,
  textToDisplay: string,
  conditionalFilterFunction: (objects: Partial<T>[]) => Partial<T>[],
  onEnabled: (
    uuid: string,
    conditionalFilterFunction: ConditionalFilterFunction<T>
  ) => void,
  onDisabled: (uuid: string) => void,
  filtersStore: any
}

export const ConditionalQuickFilter = observer(<T extends any>(props: Props<T>) => {
  const { uuid, conditionalFilterFunction, textToDisplay, onEnabled, onDisabled, filtersStore } = props;

  const enabledConditionalFilters = filtersStore.getConditionalQuickFilters();

  function isEnabled(): boolean {
    return Boolean(enabledConditionalFilters[uuid])
  }

  function onClick() {
    const needsToBecomeEnabled = !isEnabled();
    
    if (needsToBecomeEnabled) onEnabled(uuid, conditionalFilterFunction)
    else onDisabled(uuid)
  }

  return (
    <div 
      className={`conditional-quick-filter-btn filter-btn ${isEnabled() ? 'filter-active' : ''}`} 
      onClick={(_) => onClick()}>{textToDisplay}
    </div>
  )
});