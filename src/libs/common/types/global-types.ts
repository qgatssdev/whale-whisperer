export interface PaginatedQuery {
  page?: number;
  size?: number;
  filter?: string | boolean;
  filterBy?: string;
  order?: 'asc' | 'desc';
  orderBy?: string;
  from?: string;
  to?: string;
}
