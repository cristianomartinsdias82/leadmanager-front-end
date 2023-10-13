import { Component, OnInit } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { ActivityIndicatorService } from "./shared/ui/widgets/activity-indicator/activity-indicator.service";
import { AuthenticationService } from "./shared/authentication/authentication.service";
import { OAuthEvent, OAuthService } from "angular-oauth2-oidc";
import { authConfig } from "./core/security/sso/auth-config";

@Component({
  selector: "ldm-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private activityIndicatorService: ActivityIndicatorService,
    private authService: OAuthService
  ) {
      this.authService.configure(authConfig);
      this.authService.loadDiscoveryDocumentAndTryLogin().then(doc => {
        this.authService.initCodeFlow();
      });

      this.authService.events.subscribe((ev:OAuthEvent) => {
        console.log(ev);
      });
  }

  public get activityIndicator$() {
    return this.activityIndicatorService.activityIndicatorSub$;
  }

  public get userIsAuthenticated$() {
    return this.authenticationService.userIsAuthenticated$;
  }

  ngOnInit() {

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
  }
}
