import { NotificationStickerService } from 'src/app/shared/ui/widgets/notification-sticker/notification-sticker.service';
import { Component, OnInit } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { ActivityIndicatorService } from "./shared/ui/widgets/activity-indicator/activity-indicator.service";
import { AuthenticationService } from "./core/security/authentication/authentication.service";
import { MessageTypes } from './shared/ui/notification/message-types';
import { delay, filter } from 'rxjs';

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
    private notificationStickerService: NotificationStickerService) {}

  get activityIndicator$() {
    return this.activityIndicatorService.activityIndicatorSub$;
  }

  get userIsAuthenticated$() {
    return this.authenticationService.userIsAuthenticated$;
  }

  get userIsOnline$() {
    return this.authenticationService.userIsOnline$;
  }

  ngOnInit() {

    setTimeout(() => {
      this.router.events.subscribe({
        next: (event) => {

          if (event instanceof NavigationStart) {
            this.activityIndicatorService.show();
          }
          else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationError ||
            event instanceof NavigationCancel ||
            ((event as any).routerEvent /*Handles access-denied routing event*/)
          ) {
            this.activityIndicatorService.hide();
          }
        },
        error: (_) => {
          this.activityIndicatorService.hide();
        },
        complete: () => {
          this.activityIndicatorService.hide();
        }
        
      });

      this.authenticationService.checkUserIsAuthenticated();

      this.authenticationService
            .sessionUserData$
            .pipe(
              filter(data => !!data)
            )
            .subscribe(userData => this.notificationStickerService.show(`Olá, ${userData!.email}`, MessageTypes.Success));
    });
  }

}
