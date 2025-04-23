import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AdminRoutingModule } from '../routing/admin-routing.module';
import { AdminLayoutComponent } from '../../layout/admin-layout.component';
import { FileUploadsListComponent } from '../../features/list-uploaded-files/view/file-uploads-list.component';

import { SideMenuComponent } from '../../layout/side-menu/side-menu.component';
import { UsersActionsListComponent } from '../../features/list-users-actions/view/users-actions-list.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    UsersActionsListComponent,
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
