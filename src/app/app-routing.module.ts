import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLeadsComponent } from './leads/list/views/list-leads/list-leads.component';
import { MaintainLeadComponent } from './leads/maintain/views/maintain-lead/maintain-lead.component';
import { LeaveConfirmationGuard } from './common/ui/navigation/leave-confirmation.guard';

const routes: Routes = [
  { path: '', component: ListLeadsComponent },
  { path: 'leads', component: ListLeadsComponent },
  { path: 'leads/novo', component: MaintainLeadComponent, canDeactivate: [LeaveConfirmationGuard] },
  { path: 'leads/editar/:id', component: MaintainLeadComponent, canDeactivate: [LeaveConfirmationGuard] },
  { path: '**', component: ListLeadsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
