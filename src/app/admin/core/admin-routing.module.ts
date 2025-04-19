import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../views/components/admin.component';
import { AuditReportComponent } from '../views/components/audit-report/audit-report.component';
import { FileUploadsListComponent } from '../views/components/file-uploads-list/file-uploads-list.component';

//https://blog.devgenius.io/the-art-of-nested-router-outlets-in-angular-dafb38245a30
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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
