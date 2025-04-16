import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './core/admin-routing.module';
import { AdminComponent } from './views/components/admin/admin.component';
import { FileUploadsListComponent } from './views/components/admin/file-uploads-list/file-uploads-list.component';
import { AuditReportComponent } from './views/components/admin/audit-report/audit-report.component';

@NgModule({
  declarations: [
    AdminComponent,
    AuditReportComponent,
    FileUploadsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
