import { SerializedLeadData } from './../../../models/serialized-lead-data';
import { Component, Inject } from "@angular/core";
import { AuditEntry } from '../../../models/audit-entry';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataVersion } from '../../../common/data-version';
import { ObjectProps } from '../../../common/object-props';
import { getLeadDataAsDataItems } from '../../../common/get-lead-data-as-data-items';

@Component({
  selector: 'ldm-update-action-data-panel',
  templateUrl: './update-action-data-panel.component.html',
  styleUrls: ['./update-action-data-panel.component.scss']
})
export class UpdateActionDataPanelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private auditEntry: AuditEntry) {}

  private getDataItems(version: DataVersion) {

    const previousDataObjProps:ObjectProps<SerializedLeadData> = JSON.parse(this.auditEntry.oldData);
    const currentDataObjProps:ObjectProps<SerializedLeadData> = JSON.parse(this.auditEntry.newData!);

     if (version === DataVersion.Current)
       return getLeadDataAsDataItems(currentDataObjProps, previousDataObjProps);

    return getLeadDataAsDataItems(previousDataObjProps, currentDataObjProps);
  }

  get previousData() {
    return this.getDataItems(DataVersion.Previous);
  }

  get currentData() {
    return this.getDataItems(DataVersion.Current);
  }
}