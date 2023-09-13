import { ExceptionData } from "./infrastructure/exception-data";
import { Inconsistency } from "./infrastructure/inconsistency";
import { OperationCodes } from "./infrastructure/operation-codes";

export interface ApplicationResponse<T> {
    success: boolean;
    operationCode?: OperationCodes,
    message?: string,
    data?: T,
    exception?: ExceptionData,
    inconsistencies?: Inconsistency[]
}