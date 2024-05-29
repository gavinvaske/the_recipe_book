import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import axios from "axios";
import * as JsSearch from 'js-search';

/* Mobx Store */
class InventorySummaryStore {
  inventorySummary: Partial<MaterialInventorySummary> = {};
  textFilter: string = ''
  quickFilters = {}

  constructor() {
    makeAutoObservable(this);
  }

  getTextFilter(): string {
    return this.textFilter
  }

  setTextFilter(value: string): void {
    this.textFilter = value
  }

  setQuickFilter(uuid: string, value: string): void {
    this.quickFilters[uuid] = value
  }

  removeQuickFilter(uuid: string): void {
    delete this.quickFilters[uuid];
  }

  resetAllFilters(): void {
    this.textFilter = ''
    this.quickFilters = {};
  }

  setInventorySummary(inventorySummary: MaterialInventorySummary) {
    this.inventorySummary = inventorySummary;
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    return this.inventorySummary;
  }

  applyFilters(materialInventories: MaterialInventory[] | undefined) {
    const noFiltersAreApplied = !this.textFilter && Object.keys(this.quickFilters).length === 0

    if (noFiltersAreApplied) return materialInventories;
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

    const quickFiltersQuery = Object.values(this.quickFilters).join(' ')
    const searchQuery = `${this.textFilter} ${quickFiltersQuery}`

    return search.search(searchQuery)
  }

  getFilteredMaterialInventories(): MaterialInventory[] {
    return this.applyFilters(toJS(this.inventorySummary.materialInventories)) || [];
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