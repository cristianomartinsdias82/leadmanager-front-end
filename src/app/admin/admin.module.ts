import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './core/admin-routing.module';
import { AdminComponent } from './views/components/admin.component';
import { FileUploadsListComponent } from './views/components/file-uploads-list/file-uploads-list.component';
import { AuditReportComponent } from './views/components/audit-report/audit-report.component';
import { SideMenuComponent } from './views/widgets/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AdminComponent,
    AuditReportComponent,
    FileUploadsListComponent,
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
