export interface SearchQuery {
  query?: string;
  pageIndex?: string;
  limit?: string;
  sortField?: string | undefined;
  sortDirection?: '1' | '-1' | undefined;
}

export interface SearchResult<T> {
  currentPageIndex: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  results: T[];
}