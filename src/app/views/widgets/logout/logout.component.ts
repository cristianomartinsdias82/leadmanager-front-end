import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/security/authentication/authentication.service';
import { ActivityIndicatorService } from 'src/app/shared/ui/widgets/activity-indicator/activity-indicator.service';

@Component({
  selector: 'ldm-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private authenticationService: AuthenticationService,
    private activityIndicatorService: ActivityIndicatorService) {}

  onLogoutClick() {
    this.authenticationService.logout();
  }

  get activityIndicator$() {
    return this.activityIndicatorService.activityIndicatorSub$;
  }
}