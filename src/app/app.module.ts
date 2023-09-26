import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { registerLocaleData } from "@angular/common";
import { RequestHandlerInterceptorProvider } from "./leads/core/request-handler.interceptor-provider";
import localePt from "@angular/common/locales/pt";
import { AppComponent } from "./app.component";
import { AuthenticateComponent } from "./views/components/authenticate/authenticate.component";
import { NotFoundComponent } from "./views/components/not-found/not-found.component";

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    NotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    RequestHandlerInterceptorProvider,
    { provide: LOCALE_ID, useValue: "pt-BR" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
