import { Component, OnInit } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { ActivityIndicatorService } from "./shared/ui/widgets/activity-indicator/activity-indicator.service";
import { AuthenticationService } from "./core/security/authentication/authentication.service";

@Component({
  selector: "ldm-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private activityIndicatorService: ActivityIndicatorService,
    private authenticationService: AuthenticationService) {}

  public get activityIndicator$() {
    return this.activityIndicatorService.activityIndicator$;
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
  }
  
}
