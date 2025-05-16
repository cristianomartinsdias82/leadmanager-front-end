import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout.component';
import { FileUploadsListComponent } from '../../features/list-uploaded-files/view/file-uploads-list.component';
import { UsersActionsListComponent } from '../../features/list-users-actions/view/users-actions-list.component';
import { UsersListLoadingResolver } from '../resolution/users-list-loading.resolver';

//https://blog.devgenius.io/the-art-of-nested-router-outlets-in-angular-dafb38245a30
const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent, resolve: {init: UsersListLoadingResolver },
    children: [
      {
        path: 'users-actions',
        component: UsersActionsListComponent
        
      },
      {
        path: 'uploaded-files',
        component: FileUploadsListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
