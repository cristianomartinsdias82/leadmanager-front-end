import { Lead } from "src/app/leads/shared/models/lead";
import { RecordStates } from "./record-states";
import { RevisionUpdate } from "./revision-update";

export interface ConflictResolutionData {
    recordState: RecordStates,
    revisionUpdate?: RevisionUpdate
    leadData?: Lead
}