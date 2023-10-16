import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { AuthModule, AbstractSecurityStorage, DefaultLocalStorageService } from "angular-auth-oidc-client";

import { registerLocaleData } from "@angular/common";
import { RequestHandlerInterceptorProvider } from "./leads/core/request-handler.interceptor-provider";
import localePt from "@angular/common/locales/pt";

import { AppComponent } from "./app.component";
import { LogoutComponent } from "./views/widgets/logout/logout.component";
import { AuthCallbackComponent } from './core/security/authentication/components/auth-callback/auth-callback.component';
import { UserLoggedOutComponent } from './views/components/user-logged-out/user-logged-out.component';
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { environment } from "src/environments/environment";

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LogoutComponent,
    AuthCallbackComponent,
    UserLoggedOutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule.forRoot({config: environment.authConfig})
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
    RequestHandlerInterceptorProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
