export interface AuditEntry {
    id: string;
    userId: string;
    actionDateTime: Date
    action: string;
    subjectId: string;
    oldData: string;
    newData?: string;
}