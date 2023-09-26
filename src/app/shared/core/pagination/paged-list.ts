export interface PagedList<T> {
    items: T[],
    pageCount: number,
    itemCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}