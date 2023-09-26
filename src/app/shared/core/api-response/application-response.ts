import { ExceptionData } from "./exception-data";
import { Inconsistency } from "./inconsistency";
import { OperationCodes } from "./operation-codes";

export interface ApplicationResponse<T> {
    success: boolean;
    operationCode?: OperationCodes,
    message?: string,
    data?: T,
    exception?: ExceptionData,
    inconsistencies?: Inconsistency[]
}
