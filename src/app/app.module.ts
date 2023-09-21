import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { RequestHandlerInterceptorProvider } from "./core/services/request-handling/request-handler.interceptor-provider";

import { AppComponent } from "./app.component";
import { ListLeadsComponent } from "./leads/list/list-leads/views/list-leads.component";
import { MaintainLeadComponent } from "./leads/maintain/maintain-lead/views/maintain-lead.component";
import { LeadFormComponent } from "./leads/maintain/maintain-lead/views/components/lead-form/lead-form.component";
import { LeadBulkInsertFormComponent } from "./leads/maintain/maintain-lead/views/components/lead-bulk-insert-form/lead-bulk-insert-form.component";

import { registerLocaleData } from "@angular/common";

import localePt from "@angular/common/locales/pt";

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    ListLeadsComponent,
    MaintainLeadComponent,
    LeadFormComponent,
    LeadBulkInsertFormComponent
  ],
  imports: [AppRoutingModule, SharedModule],
  providers: [
    RequestHandlerInterceptorProvider,
    { provide: LOCALE_ID, useValue: "pt-BR" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
