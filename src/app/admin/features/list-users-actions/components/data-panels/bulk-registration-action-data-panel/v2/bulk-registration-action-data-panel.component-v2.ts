import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditEntry } from '../../../../models/audit-entry';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BulkRegistrationActionDataPanelDataSource } from './bulk-registration-action-data-panel.datasource-v2';
import { SerializedLeadData } from '../../../../models/serialized-lead-data';

@Component({
  selector: 'ldm-bulk-registration-action-data-panel-v2',
  templateUrl: './bulk-registration-action-data-panel.component-v2.html',
  styleUrls: ['./bulk-registration-action-data-panel-v2.scss']
})
export class BulkRegistrationActionDataPanelComponentV2 implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SerializedLeadData>;
  
  displayedColumns = ["razaoSocial", "cidade", "estado", "acoes"];
  pageSizeOptions = [5,10,20];
  dataSource: BulkRegistrationActionDataPanelDataSource = null!;

  constructor(@Inject(MAT_DIALOG_DATA) private auditEntry: AuditEntry) {}

  ngOnInit() {
    this.dataSource = new BulkRegistrationActionDataPanelDataSource(JSON.parse(this.auditEntry.oldData));
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
