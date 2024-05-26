import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import axios from "axios";
import * as JsSearch from 'js-search';

/* Mobx Store */
class InventorySummaryStore {
  inventorySummary: Partial<MaterialInventorySummary> = {};
  textFilter: string = ''

  getTextFilter(): string {
    return this.textFilter
  }

  setTextFilter(value: string): void {
    this.textFilter = value
  }

  constructor() {
    makeAutoObservable(this);
  }

  setInventorySummary(inventorySummary: MaterialInventorySummary) {
    this.inventorySummary = inventorySummary;
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    return this.inventorySummary;
  }

  foobarTextFilter(materialInventories: MaterialInventory[] | undefined) {
    if (!this.textFilter) return materialInventories;
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

    return search.search(this.textFilter)
  }

  getMaterialInventories() {
    return this.foobarTextFilter(toJS(this.inventorySummary.materialInventories));
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