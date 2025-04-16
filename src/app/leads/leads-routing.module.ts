import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLeadsComponent } from './list/list-leads/views/list-leads.component';
import { LeaveConfirmationGuard } from '../shared/ui/navigation/leave-confirmation.guard';
import { MaintainLeadComponent } from './maintain/maintain-lead/views/maintain-lead.component';

const routes: Routes = [
  { path: '', component: ListLeadsComponent },
  {
    path: "novo",
    component: MaintainLeadComponent,
    canDeactivate: [LeaveConfirmationGuard],
  },
  {
    path: "editar/:id",
    component: MaintainLeadComponent,
    canDeactivate: [LeaveConfirmationGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
