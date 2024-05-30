import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import axios from "axios";
import * as JsSearch from 'js-search';

export type ConditionalFilterFunction<T> = (objects: Partial<T>[]) => Partial<T>[]
type TextQuickFilters = {[key: string]: string}

interface Filter<T> {
  searchBarInput: string;
  textQuickFilters: TextQuickFilters;
  conditionalQuickFilters: {[key: string]: ConditionalFilterFunction<T>}

  getSearchBarInput(): string
  setSearchBarInput(value: string): void

  setTextQuickFilter(uuid: string, value: string): void
  removeTextQuickFilter(uuid: string): void

  setConditionalQuickFilter(uuid: string, conditionalFilter: ConditionalFilterFunction<T>)
  removeConditionalFilter(uuid: string): void

  resetAllFilters(): void

  generateSearchQuery(searchBarInput: string, textQuickFilters: TextQuickFilters): void

  applyFilters(objects: T[] | undefined): T[]
}

/* Mobx Store */
class InventorySummaryStore implements Filter<MaterialInventory> {
  inventorySummary: Partial<MaterialInventorySummary> = {};
  searchBarInput: string = ''
  textQuickFilters = {}
  conditionalQuickFilters: {[key: string]: ConditionalFilterFunction<MaterialInventory>} = {}

  constructor() {
    makeAutoObservable(this);
  }

  getSearchBarInput(): string {
    return this.searchBarInput;
  }

  setSearchBarInput(value: string): void {
    this.searchBarInput = value
  }

  setConditionalQuickFilter(uuid: string, conditionalFilter: ConditionalFilterFunction<MaterialInventory>): void {
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

  setInventorySummary(inventorySummary: MaterialInventorySummary) {
    this.inventorySummary = inventorySummary;
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    return this.inventorySummary;
  }

  generateSearchQuery(searchBarInput: string, textQuickFilters: TextQuickFilters): string {
    const quickFiltersQuery = Object.values(textQuickFilters).join(' ')
    const trimmedSearchBarInput = searchBarInput.trim();

    if (trimmedSearchBarInput || quickFiltersQuery) {
      return `${trimmedSearchBarInput} ${quickFiltersQuery}`
    }

    return '';
  }

  applyFilters(materialInventories: MaterialInventory[] | undefined): MaterialInventory[] {
    const noFiltersAreApplied = !this.searchBarInput && Object.keys(this.textQuickFilters).length === 0 && Object.keys(this.conditionalQuickFilters).length === 0

    if (noFiltersAreApplied) return materialInventories || [];
    if (!materialInventories) return [];

    const search = new JsSearch.Search(['material', '_id']);

    search.addIndex(['material', 'name']);
    search.addIndex(['material', 'materialId']);
    search.addIndex(['material', 'materialCategory', 'name']);
    search.addIndex(['material', 'vendor', 'name']);
    search.addIndex(['material', 'adhesiveCategory', 'name']);
    search.addIndex(['material', 'description']);
    search.addIndex(['material', 'faceColor']);
    search.addIndex(['material', 'thickness']);
    search.addDocuments(materialInventories);

    const searchQuery: string = this.generateSearchQuery(this.searchBarInput, this.textQuickFilters)

    const textSearchResults = searchQuery ? search.search(searchQuery) as MaterialInventory[] : materialInventories

    const conditionalFilterFunctions = Object.values(this.conditionalQuickFilters)
    
    return conditionalFilterFunctions.reduce((acc, conditionalFilterFunction: any) => {
      return conditionalFilterFunction(acc)
    }, textSearchResults)
  }

  getFilteredMaterialInventories(): MaterialInventory[] {
    return this.applyFilters(toJS(this.inventorySummary.materialInventories));
  }

  getAllMaterialInventories(): MaterialInventory[] {
    return this.inventorySummary.materialInventories || [];
  }

  async recalculateInventorySummary() {
    axios.get('/materials/inventory')
      .then((response) => {
        const { data: materialInventorySummary}: {data: MaterialInventorySummary} = response;
        
        this.setInventorySummary(materialInventorySummary);
      })
      .catch((error) => {
        alert('Error fetching the inventory for materials:'+ error.message);
      })
  }
}

export default new InventorySummaryStore();