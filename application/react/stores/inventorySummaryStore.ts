import { makeAutoObservable, toJS } from "mobx";
import { MaterialInventory, MaterialInventorySummary } from "../Inventory/Inventory";
import * as JsSearch from 'js-search';
import { ConditionalFilterFunction, UuidToTextFilter, Filter, UuidToConditionalFilter } from "@ui/types/filters";
import { IMaterial } from "@shared/types/models";
import { MongooseIdStr } from "@shared/types/typeAliases";

/* Mobx Store */
class InventorySummaryStore implements Filter<MaterialInventory> {
  inventorySummary: Partial<MaterialInventorySummary> = {};
  searchBarInput: string = ''
  textQuickFilters: UuidToTextFilter = {}
  conditionalQuickFilters: UuidToConditionalFilter<MaterialInventory> = {}
  materials: Record<MongooseIdStr, IMaterial> = {};

  constructor() {
    makeAutoObservable(this);
  }

  getSearchBarInput(): string {
    return this.searchBarInput;
  }

  getTextQuickFilters(): UuidToTextFilter {
    return this.textQuickFilters;
  }

  getConditionalQuickFilters(): UuidToConditionalFilter<MaterialInventory> {
    return this.conditionalQuickFilters;
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

  calculateLengthOfArrivedMaterials() {
    return Object.values(this.materials).reduce((sum, material) => sum + material.inventory.lengthArrived, 0)
  }

  calculateLengthOfNotArrivedMaterials() {
    return Object.values(this.materials).reduce((sum, material) => sum + material.inventory.lengthNotArrived, 0)
  }

  calculateNetLengthAdjustments() {
    return Object.values(this.materials).reduce((sum, material) => sum + material.inventory.manualLengthAdjustment, 0)
  }

  getInventorySummary(): Partial<MaterialInventorySummary> {
    const lengthOfArrivedMaterials = this.calculateLengthOfArrivedMaterials()
    const lengthOfNotArrivedMaterials = this.calculateLengthOfNotArrivedMaterials()
    const netLengthAdjustments = this.calculateNetLengthAdjustments()
    const netLengthOfMaterialInInventory = lengthOfArrivedMaterials + netLengthAdjustments - lengthOfNotArrivedMaterials
    
    return {
      lengthOfAllMaterialsInInventory: lengthOfArrivedMaterials,
      lengthOfAllMaterialsOrdered: lengthOfNotArrivedMaterials,
      netLengthOfMaterialInInventory: netLengthOfMaterialInInventory
    }
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

  getMaterials(): IMaterial[] {
    return Object.values(this.materials)
  }

  setMaterial(material: IMaterial): void {
    this.materials[material._id as string] = material;
  }

  setMaterials(materials: IMaterial[]): void {
    this.materials = materials.reduce((acc, material) => {
      acc[material._id as string] = material;
      return acc;
    }, {} as Record<MongooseIdStr, IMaterial>);
  }

  removeMaterial(id: MongooseIdStr): void {
    delete this.materials[id];
  }
}

export default new InventorySummaryStore();