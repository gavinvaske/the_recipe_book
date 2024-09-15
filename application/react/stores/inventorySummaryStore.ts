import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import axios, { AxiosError, AxiosResponse } from "axios";
import { IFilter } from "../_types/Filters";
import { useErrorMessage } from "../_hooks/useErrorMessage";
import { Filters } from "./filters";

/* Mobx Store */
class InventorySummaryStore {
  inventorySummary: Partial<MaterialInventorySummary> = {};
  filters: IFilter<MaterialInventory>;

  constructor() {
    const jsSearchIndex = ['material', '_id'];
    const jsSearchIndexFields = [
      ['material', 'name'],
      ['material', 'materialId'],
      ['material', 'materialCategory', 'name'],
      ['material', 'vendor', 'name'],
      ['material', 'adhesiveCategory', 'name'],
      ['material', 'description'],
      ['material', 'faceColor'],
      ['material', 'thickness']
    ]
    this.filters = new Filters<MaterialInventory>(jsSearchIndex, jsSearchIndexFields);
    makeAutoObservable(this);
  }

  setInventorySummary(inventorySummary: MaterialInventorySummary) {
    this.inventorySummary = inventorySummary;
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    return this.inventorySummary;
  }

  getFilteredMaterialInventories(): MaterialInventory[] {
    return this.filters.applyFilters(toJS(this.inventorySummary.materialInventories));
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
      .catch((error: AxiosError) => useErrorMessage(error))
  }
}

export default new InventorySummaryStore();