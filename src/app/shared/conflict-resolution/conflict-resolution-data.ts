import { RecordStates } from "src/app/leads/shared/services/conflict-resolution/record-states"
import { RevisionUpdate } from "src/app/leads/shared/services/conflict-resolution/revision-update"

export interface ConflictResolutionData<T> {
    recordState: RecordStates,
    revisionUpdate?: RevisionUpdate
    data?: T
}
