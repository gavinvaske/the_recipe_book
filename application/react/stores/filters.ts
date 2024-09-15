import { makeAutoObservable } from "mobx";
import { ConditionalFilterFunction, UuidToTextFilter, IFilter, UuidToConditionalFilter } from "../_types/Filters";
import * as JsSearch from 'js-search';

export class Filters<T> implements IFilter<T> {
  searchableItems: T[] = [];
  searchBarInput: string = '';
  textQuickFilters: UuidToTextFilter = {}
  conditionalQuickFilters: UuidToConditionalFilter<T> = {}
  jsSearch: JsSearch.Search;

  constructor(jsSearchIndex: string | string[], jsSearchIndexFields: string | Array<Array<string>>) {
    this.jsSearch = new JsSearch.Search(jsSearchIndex);

    if (Array.isArray(jsSearchIndexFields)) {
      jsSearchIndexFields.forEach(field => this.jsSearch.addIndex(field));
    } else {
      this.jsSearch.addIndex(jsSearchIndex);
    }

    makeAutoObservable(this);
  }
  
  getSearchBarInput(): string {
    return this.searchBarInput;
  }

  getTextQuickFilters(): UuidToTextFilter {
    return this.textQuickFilters;
  }

  getConditionalQuickFilters(): UuidToConditionalFilter<T> {
    return this.conditionalQuickFilters;
  }

  setSearchBarInput(value: string): void {
    this.searchBarInput = value
  }

  setConditionalQuickFilter(uuid: string, conditionalFilter: ConditionalFilterFunction<T>): void {
    this.conditionalQuickFilters[uuid] = conditionalFilter
  }

  removeConditionalFilter(uuid: string): void {
    delete this.conditionalQuickFilters[uuid]
  }
  
  setTextQuickFilter(uuid: string, value: string): void {
    this.textQuickFilters[uuid] = value
  }
  
  removeTextQuickFilter(uuid: string): void {
    delete this.textQuickFilters[uuid];
  }

  resetAllFilters(): void {
    this.searchBarInput = ''
    this.textQuickFilters = {};
    this.conditionalQuickFilters = {};
  }

  generateSearchQuery(searchBarInput: string, textQuickFilters: UuidToTextFilter): string {
    const quickFiltersQuery = Object.values(textQuickFilters).join(' ')
    const trimmedSearchBarInput = searchBarInput.trim();

    if (trimmedSearchBarInput || quickFiltersQuery) {
      return `${trimmedSearchBarInput} ${quickFiltersQuery}`
    }

    return '';
  }

  applyFilters(searchableItems: T[] | undefined): T[] {
    const noFiltersAreApplied = !this.searchBarInput && Object.keys(this.textQuickFilters).length === 0 && Object.keys(this.conditionalQuickFilters).length === 0

    if (noFiltersAreApplied) return searchableItems || [];
    if (!searchableItems) return [];

    this.jsSearch.addDocuments(searchableItems as Object[]);

    const searchQuery: string = this.generateSearchQuery(this.searchBarInput, this.textQuickFilters)

    const textSearchResults = searchQuery ? this.jsSearch.search(searchQuery) as T[] : searchableItems

    const conditionalFilterFunctions = Object.values(this.conditionalQuickFilters)
    
    return conditionalFilterFunctions.reduce((acc, conditionalFilterFunction: any) => {
      return conditionalFilterFunction(acc)
    }, textSearchResults)
  }
}