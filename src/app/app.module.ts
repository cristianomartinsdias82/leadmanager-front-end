import { NgModule, LOCALE_ID, APP_INITIALIZER  } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

import { registerLocaleData } from "@angular/common";
import { RequestHandlerInterceptorProvider } from "./leads/core/request-handler.interceptor-provider";
import localePt from "@angular/common/locales/pt";

import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./views/components/not-found/not-found.component";
import { LogoutComponent } from './views/components/logout/logout.component';
//import { initializeApp } from "./core/bootstraping/initlialize-app.fn";
import { HomeComponent } from './views/components/home/home.component';

import { oAuthStorageFactory } from "./core/security/sso/oAuthStorageFactory.fn";

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LogoutComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    OAuthModule.forRoot()
  ],
  providers: [
    RequestHandlerInterceptorProvider,
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: OAuthStorage, useFactory: oAuthStorageFactory }
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   multi: true,
    // }    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
