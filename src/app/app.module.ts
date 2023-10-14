import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";

import { registerLocaleData } from "@angular/common";
import { RequestHandlerInterceptorProvider } from "./leads/core/request-handler.interceptor-provider";
import localePt from "@angular/common/locales/pt";

import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { AbstractSecurityStorage, AuthModule, DefaultLocalStorageService } from "angular-auth-oidc-client";
import { authConfig } from "./core/security/authentication/auth-config";
import { LogoutComponent } from "./views/components/logout/logout.component";
import { AuthCallbackComponent } from './core/security/authentication/components/auth-callback/auth-callback.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LogoutComponent,
    AuthCallbackComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule.forRoot({config: authConfig})
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
    RequestHandlerInterceptorProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
