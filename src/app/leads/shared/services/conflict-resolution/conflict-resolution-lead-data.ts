import { Lead } from "src/app/leads/shared/models/lead";
import { RecordStates } from "./record-states";
import { RevisionUpdate } from "./revision-update";
import { ConflictResolutionData } from "src/app/shared/conflict-resolution/conflict-resolution-data";

export interface ConflictResolutionLeadData extends ConflictResolutionData<Lead> {
    recordState: RecordStates,
    revisionUpdate?: RevisionUpdate
    leadData?: Lead
}
