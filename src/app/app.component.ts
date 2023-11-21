import { Component, OnInit } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { ActivityIndicatorService } from "./shared/ui/widgets/activity-indicator/activity-indicator.service";
import { AuthenticationService } from "./core/security/authentication/authentication.service";
import { PromptService } from "./shared/ui/widgets/prompt-dialog/prompt.service";
import { OneTimePasswordComponent } from "./core/security/authorization/components/one-time-password/one-time-password.component";
import { Permissions } from "./core/security/permissions";
import { Observable, of } from "rxjs";
import { OneTimePasswordComponentData } from "./core/security/authorization/components/one-time-password/one-time-password-component-data";
import { ApplicationResponse } from "./shared/core/api-response/application-response";
import { environment } from "src/environments/environment";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "ldm-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private activityIndicatorService: ActivityIndicatorService,
    private authenticationService: AuthenticationService,
    private promptService: PromptService) {}

  public get activityIndicator$() {
    return this.activityIndicatorService.activityIndicatorSub$;
  }

  public get userIsAuthenticated$() {
    return this.authenticationService.userIsAuthenticated$;
  }

  public get userIsOnline$() {
    return this.authenticationService.userIsOnline$;
  }

  ngOnInit() {

    setTimeout(() => {
      this.router.events.subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            this.activityIndicatorService.show();
          } else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationError ||
            event instanceof NavigationCancel
          ) {
            this.activityIndicatorService.hide();
          }
        },
        error: (_) => {
          this.activityIndicatorService.hide();
        },
      });

      this.authenticationService.checkUserIsAuthenticated();
    }, 0);

    this.resetOneTimePassword();
  }


  oneTimePasswordDialogRef: MatDialogRef<OneTimePasswordComponent> = null!;

  resetOneTimePassword() {
    
    if (!!this.oneTimePasswordDialogRef) {
      this.oneTimePasswordDialogRef.close();
    }

    setTimeout(() => {
      this.oneTimePasswordDialogRef = this.promptService
          .openDialog<OneTimePasswordComponent, OneTimePasswordComponentData>(
            OneTimePasswordComponent,
            {
              digitCount: environment.oneTimePassword.digitCount,
              lifeSpanInSeconds: environment.oneTimePassword.lifeSpanInSeconds,
              requestedPermission: Permissions.Delete,
              onSend: this.onSend,
              onResendCodeRequested: () => { return this.onResendCode() }
            },
            environment.oneTimePassword.dialogWithInPercent);
    },
    500);

  }

  onSend(input: string) : Observable<ApplicationResponse<boolean>> {
    console.log('sending', input);
    return of({
      success: true
    });
  }

  onResendCode() : Observable<ApplicationResponse<boolean>> {
    this.resetOneTimePassword();
    console.log('sending new code');
    return of({
      success: true
    });
  }
  
}
