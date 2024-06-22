export type ConditionalFilterFunction<T> = (objects: Partial<T>[]) => Partial<T>[]

export type UuidToTextFilter = {[key: string]: string}

export interface Filter<T> {
  searchBarInput: string;
  textQuickFilters: UuidToTextFilter;
  conditionalQuickFilters: {[key: string]: ConditionalFilterFunction<T>}

  getSearchBarInput(): string
  setSearchBarInput(value: string): void

  setTextQuickFilter(uuid: string, value: string): void
  removeTextQuickFilter(uuid: string): void

  setConditionalQuickFilter(uuid: string, conditionalFilter: ConditionalFilterFunction<T>): void
  removeConditionalFilter(uuid: string): void

  resetAllFilters(): void

  generateSearchQuery(searchBarInput: string, textQuickFilters: UuidToTextFilter): void

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