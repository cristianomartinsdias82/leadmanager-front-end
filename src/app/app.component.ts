import { Component, OnInit } from "@angular/core";
import { ActivityIndicatorService } from "./common/ui/widgets/activity-indicator/activity-indicator.service";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";

@Component({
  selector: "ldm-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {

  activityIndicator$ = this.activityIndicatorService.activityIndicatorSub$;

  constructor(
    private router: Router,
    private activityIndicatorService: ActivityIndicatorService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          this.activityIndicator$.next(true);
        } else if (event instanceof NavigationEnd ||
                   event instanceof NavigationError ||
                   event instanceof NavigationCancel) {
          this.activityIndicator$.next(false);
        }
      },
      error: (_) => {
        this.activityIndicator$.next(false);
      }
    });
  }
}