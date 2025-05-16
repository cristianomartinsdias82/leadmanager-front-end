import { SystemActions } from "./system-actions";

export interface AuditEntry {
    id: string;
    userId: string;
    actionDateTime: Date
    action: SystemActions,
    subjectId: string;
    oldData: string;
    newData?: string;
}