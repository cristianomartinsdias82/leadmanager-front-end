import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { ListLeadsComponent } from './leads/list/views/list-leads/list-leads.component';
import { MaintainLeadComponent } from './leads/maintain/views/maintain-lead/maintain-lead.component';
import { PromptComponent } from './common/ui/widgets/prompt-dialog/prompt.component';
import { CnpjMaskDirective } from './common/ui/input-masks/cnpj-mask.directive';
import { CepMaskDirective } from './common/ui/input-masks/cep-mask.directive';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ErrorHandlerInterceptorProvider } from './common/infrastructure/error-handling.interceptor';
import { ActivityIndicatorComponent } from './common/ui/widgets/activity-indicator/activity-indicator.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    ListLeadsComponent,
    MaintainLeadComponent,
    PromptComponent,
    CnpjMaskDirective,
    CepMaskDirective,
    ActivityIndicatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    ErrorHandlerInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
