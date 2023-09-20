import { Component, OnInit } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { ActivityIndicatorService } from "./shared/ui/widgets/activity-indicator/activity-indicator.service";

@Component({
  selector: "ldm-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activityIndicatorService: ActivityIndicatorService
  ) {}

  public get activityIndicator$() {
    return this.activityIndicatorService.activityIndicatorSub$;
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
