import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../views/components/admin/admin.component';
import { AuditReportComponent } from '../views/components/admin/audit-report/audit-report.component';
import { FileUploadsListComponent } from '../views/components/admin/file-uploads-list/file-uploads-list.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent
  },
  {
    path: 'audit-report',
    component: AuditReportComponent
  },
  {
    path: 'uploaded-files',
    component: FileUploadsListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
