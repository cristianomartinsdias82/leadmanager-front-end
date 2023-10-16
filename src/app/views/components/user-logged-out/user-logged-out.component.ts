import { Component, OnInit } from '@angular/core';
import { ActivityIndicatorService } from 'src/app/shared/ui/widgets/activity-indicator/activity-indicator.service';

@Component({
  selector: "ldm-user-logged-out",
  templateUrl: "./user-logged-out.component.html",
  styleUrls: ["./user-logged-out.component.scss"],
})
export class UserLoggedOutComponent implements OnInit {

  constructor(private activityIndicatorService: ActivityIndicatorService) {}

  ngOnInit() {
    setTimeout(() => this.activityIndicatorService.hide(), 0);
  }

}