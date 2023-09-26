import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LeadsRoutingModule } from './leads-routing.module';
import { ListLeadsComponent } from './list/list-leads/views/list-leads.component';
import { MaintainLeadComponent } from './maintain/maintain-lead/views/maintain-lead.component';
import { LeadFormComponent } from './maintain/maintain-lead/views/components/lead-form/lead-form.component';
import { LeadBulkInsertFormComponent } from './maintain/maintain-lead/views/components/lead-bulk-insert-form/lead-bulk-insert-form.component';
import { CepMaskDirective } from './shared/ui/input-masks/cep-mask.directive';
import { CnpjMaskDirective } from './shared/ui/input-masks/cnpj-mask.directive';

@NgModule({
  declarations: [
    ListLeadsComponent,
    MaintainLeadComponent,
    LeadFormComponent,
    LeadBulkInsertFormComponent,
    CepMaskDirective,
    CnpjMaskDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeadsRoutingModule
  ],
  exports: [
    CepMaskDirective,
    CnpjMaskDirective
  ]
})
export class LeadsModule { }
