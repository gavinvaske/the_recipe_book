export type ConditionalFilterFunction<T> = (objects: Partial<T>[]) => Partial<T>[]

export type TextQuickFilters = {[key: string]: string}

export interface Filter<T> {
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

export type TextFilterOption = {
  readonly uuid: string,
  value: string
}

export type TextFilter = {
  description: string,
  options: TextFilterOption[],
}

export type ConditionalFilter<T> = {
  readonly uuid: string,
  textToDisplay: string,
  conditionalFilter: ConditionalFilterFunction<T>
}