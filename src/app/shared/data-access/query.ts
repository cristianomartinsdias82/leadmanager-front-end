import { PagingParameters } from "../core/pagination/paging-parameters"

export interface Query {
    term?: string,
    userId?: string,
    startDate?: string
    endDate?: string
    pagingParameters?: PagingParameters
}