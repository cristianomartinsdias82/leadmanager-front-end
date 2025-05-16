import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditEntry } from '../../../models/audit-entry';
import { SerializedLeadData } from '../../../models/serialized-lead-data';

@Component({
  selector: 'ldm-registration-action-data-panel',
  templateUrl: './registration-action-data-panel.component.html',
  styleUrls: ['./registration-action-data-panel.scss']
})
export class RegistrationActionDataPanelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private auditEntry: AuditEntry) {}

  get insertedData() {
      return JSON.parse(this.auditEntry.oldData) as SerializedLeadData;
    }
}