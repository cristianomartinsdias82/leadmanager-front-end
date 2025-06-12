import { ReportGenerationRequest } from "./report-generation-request";

export interface ReportGenerationMessage {
    text: string;
    requestData: ReportGenerationRequest,
}
