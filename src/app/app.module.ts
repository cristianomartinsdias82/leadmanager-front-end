import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { AuthModule, AbstractSecurityStorage, DefaultLocalStorageService } from "angular-auth-oidc-client";
import { NgxCountdownModule } from "@iamserver/ngx-countdown";

import { registerLocaleData } from "@angular/common";
import { RequestHandlerInterceptorProvider } from "./leads/core/request-handler.interceptor-provider";
import localePt from "@angular/common/locales/pt";
import { environment } from "src/environments/environment";

import { AppComponent } from "./app.component";
import { LogoutComponent } from "./views/widgets/logout/logout.component";
import { AuthCallbackComponent } from './core/security/authentication/components/auth-callback/auth-callback.component';
import { UserLoggedOutComponent } from './views/components/user-logged-out/user-logged-out.component';
import { OneTimePasswordComponent } from './core/security/authorization/components/one-time-password/one-time-password.component';
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { AccessDeniedComponent } from './views/components/access-denied/access-denied.component';
import { InboxComponent } from './views/components/inbox/inbox.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LogoutComponent,
    AuthCallbackComponent,
    UserLoggedOutComponent,
    OneTimePasswordComponent,
    AccessDeniedComponent,
    InboxComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule.forRoot({config: environment.authConfig}),
    NgxCountdownModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
    RequestHandlerInterceptorProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
