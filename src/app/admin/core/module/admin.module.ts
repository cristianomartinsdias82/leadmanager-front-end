import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AdminRoutingModule } from '../routing/admin-routing.module';
import { AdminLayoutComponent } from '../../layout/admin-layout.component';
import { FileUploadsListComponent } from '../../features/list-uploaded-files/view/file-uploads-list.component';
import { SideMenuComponent } from '../../layout/side-menu/side-menu.component';
import { UsersActionsListComponent } from '../../features/list-users-actions/view/users-actions-list.component';
import { UsersActionsSearchComponent } from '../../features/list-users-actions/components/users-actions-search/users-actions-search.component';
import { StackedDataPanelContainerComponent } from '../../features/list-users-actions/components/data-panels/layouts/stacked/stacked-data-panel-container.component';
import { FormStyleDataPanelContainerComponent } from '../../features/list-users-actions/components/data-panels/layouts/form-style/form-style-data-panel-container.component';
import { BulkRegistrationActionDataPanelComponentV1 } from '../../features/list-users-actions/components/data-panels/bulk-registration-action-data-panel/v1/bulk-registration-action-data-panel.component-v1';
import { BulkRegistrationActionDataPanelComponentV2 } from '../../features/list-users-actions/components/data-panels/bulk-registration-action-data-panel/v2/bulk-registration-action-data-panel.component-v2';
import { RegistrationActionDataPanelComponent } from '../../features/list-users-actions/components/data-panels/registration-action-data-panel/registration-action-data-panel.component';
import { RemoveActionDataPanelComponent } from '../../features/list-users-actions/components/data-panels/remove-action-data-panel/remove-action-data-panel.component';
import { UpdateActionDataPanelComponent } from '../../features/list-users-actions/components/data-panels/update-action-data-panel/update-action-data-panel.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    FileUploadsListComponent,
    SideMenuComponent,
    UsersActionsListComponent,
    UsersActionsSearchComponent,
    StackedDataPanelContainerComponent,
    FormStyleDataPanelContainerComponent,
    BulkRegistrationActionDataPanelComponentV1,
    BulkRegistrationActionDataPanelComponentV2,
    RegistrationActionDataPanelComponent,
    RemoveActionDataPanelComponent,
    UpdateActionDataPanelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
