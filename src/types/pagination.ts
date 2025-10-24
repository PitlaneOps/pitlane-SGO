export type PaginatedResponse<T> = {
  items: T[];
  hasNextPage: boolean;
};
