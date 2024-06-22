import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as JsSearch from 'js-search';
import { ConditionalFilterFunction, UuidToTextFilter, Filter } from "../_types/Filters";
import flashMessageStore from "./flashMessageStore";

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

  generateSearchQuery(searchBarInput: string, textQuickFilters: UuidToTextFilter): string {
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

    const search : JsSearch.Search = new JsSearch.Search(['material', '_id']);

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
      .then((response: AxiosResponse) => {
        const { data: materialInventorySummary}: { data: MaterialInventorySummary } = response;
        
        this.setInventorySummary(materialInventorySummary);
      })
      .catch((error: AxiosError) => flashMessageStore.addErrorMessage(error.response?.data as string || error.message))
  }
}

export default new InventorySummaryStore();