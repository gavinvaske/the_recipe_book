export interface SearchQuery {
  query?: string;
  pageIndex?: string;
  limit?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  results: T[];
}