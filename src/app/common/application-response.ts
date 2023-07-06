import { ExceptionData } from "./exception-data";
import { Inconsistency } from "./inconsistency";

export interface ApplicationResponse<T> {
    success: boolean;
    operationCode?: string,
    message?: string,
    data?: T,
    exception?: ExceptionData,
    inconsistencies?: Inconsistency[]
}