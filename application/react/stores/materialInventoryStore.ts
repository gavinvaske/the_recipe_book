import { makeAutoObservable } from "mobx";
import { MongooseId } from "../_types/typeAliases";
import { MaterialInventory } from "../Inventory/Inventory";
import axios from "axios";

type MongooseIdToMaterialInventory = {
  [id: MongooseId]: MaterialInventory;
}

/* Mobx Store dealing with "Material" database objects */
class MaterialInventoryStore {
  materialMongooseIdToMaterialInventory: MongooseIdToMaterialInventory = {};

  constructor() {
    makeAutoObservable(this);
  }

  setInventory(materialInventory: MaterialInventory[]): void {
    materialInventory && materialInventory.forEach(materialInventory => {
      this.materialMongooseIdToMaterialInventory[materialInventory.material._id] = materialInventory;
    })
  }

  getInventory(): MaterialInventory[] {
    return Object.values(this.materialMongooseIdToMaterialInventory)
  }

  fetchMaterialInventory() {
    axios.get('/materials/inventory')
      .then((response) => {
        alert("TODO: fetchMaterialInventory()")
        // const { data: materialInventorySummary}: {data: MaterialInventorySummary} = response;
        // this.materialMongooseIdToMaterialInventory[materialId] = materialInventorySummary;
      })
      .catch((error) => {
        alert('Error fetching the inventory for materials:'+ error.message);
      })
  }
}

export default new MaterialInventoryStore();