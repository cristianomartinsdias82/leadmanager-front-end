import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditEntry } from '../../../../models/audit-entry';
import { SerializedLeadData } from '../../../../models/serialized-lead-data';

@Component({
  selector: 'ldm-bulk-registration-action-data-panel-v1',
  templateUrl: './bulk-registration-action-data-panel.component-v1.html',
  styleUrls: ['./bulk-registration-action-data-panel-v1.scss']
})
export class BulkRegistrationActionDataPanelComponentV1 {
  bulkInsertedData: SerializedLeadData[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public auditEntry: AuditEntry) {
    this.bulkInsertedData = JSON.parse(this.auditEntry.oldData);
  }

  get insertedData() {
    return this.bulkInsertedData;
  }
}
