import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditEntry } from '../../../models/audit-entry';
import { SerializedLeadData } from '../../../models/serialized-lead-data';


@Component({
  selector: 'ldm-remove-action-data-panel',
  templateUrl: './remove-action-data-panel.component.html',
  styleUrls: ['./remove-action-data-panel.scss']
})
export class RemoveActionDataPanelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private auditEntry: AuditEntry) {}
  
  get deletedData() {
    return JSON.parse(this.auditEntry.oldData) as SerializedLeadData;
  }
}