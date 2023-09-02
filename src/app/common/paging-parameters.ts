import { ListSortDirection } from "./list-sort-direction";

export interface PagingParameters {
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortDirection: ListSortDirection
}