import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { RequestHandlerInterceptorProvider } from './common/infrastructure/request-handler.interceptor';

import { AppComponent } from './app.component';
import { ListLeadsComponent } from './leads/list/views/list-leads/list-leads.component';
import { MaintainLeadComponent } from './leads/maintain/views/maintain-lead/maintain-lead.component';
import { LeadFormComponent } from './leads/maintain/views/maintain-lead/components/lead-form/lead-form.component';
import { LeadBulkInsertFormComponent } from './leads/maintain/views/maintain-lead/components/lead-bulk-insert-form/lead-bulk-insert-form.component';

import { CnpjMaskDirective } from './common/ui/input-masks/cnpj-mask.directive';
import { CepMaskDirective } from './common/ui/input-masks/cep-mask.directive';

import { ActivityIndicatorComponent } from './common/ui/widgets/activity-indicator/activity-indicator.component';
import { NotificationPanelComponent } from './common/ui/widgets/notification-panel/notification-panel.component';
import { YesNoPromptComponent } from './common/ui/widgets/yes-no-prompt-dialog/yes-no-prompt.component';
import { CustomPromptComponent } from './common/ui/widgets/custom-prompt-dialog/custom-prompt.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    ListLeadsComponent,
    MaintainLeadComponent,
    YesNoPromptComponent,
    CustomPromptComponent,
    CnpjMaskDirective,
    CepMaskDirective,
    ActivityIndicatorComponent,
    LeadFormComponent,
    LeadBulkInsertFormComponent,
    NotificationPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    RequestHandlerInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
