import { makeAutoObservable } from "mobx";
import { MaterialInventorySummary } from "../Inventory/Inventory";
import axios from "axios";

/* Mobx Store dealing with "Material" database objects */
class InventorySummaryStore {
  inventorySummary: Partial<MaterialInventorySummary> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setInventorySummary(inventorySummary: MaterialInventorySummary) {
    this.inventorySummary = inventorySummary;
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    return this.inventorySummary;
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